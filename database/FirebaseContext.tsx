import React, { createContext, useState, useEffect, useContext } from 'react'
import { ActivityIndicator, DisplayError, ThemeContext, Theme } from '../components'
import { UserClaims } from './DataTypes'
import {
    useAuthState,
    callFirebaseFunction,
    getAuth,
    getFirestore,
    FirebaseUser,
    firestoreMessenging
} from './Firebase'
import { Styles } from '../app/Styles'
import { GlobalContext } from '../app/GlobalContext'
import FirebaseNotifications from './FirebaseNotifications'
import { useNavigation } from '@react-navigation/native'

type ContextType = {
    currentUser?: FirebaseUser | null
    claims?: string[]
    isLoading: boolean
    error?: any
    authToken?: string
    addClaim: (uid: string, claimName: string) => Promise<any>
    removeClaim: (uid: string, claimName: string) => Promise<any>
    getClaims: (uid: string) => Promise<any>
    setProfile: (displayName: string) => Promise<any>
}

export const FirebaseContext = createContext<ContextType>({
    isLoading: true,
    addClaim: (uid: string, claimName: string) => new Promise(() => undefined),
    removeClaim: (uid: string, claimName: string) => new Promise(() => undefined),
    getClaims: (uid: string) => new Promise(() => undefined),
    setProfile: (displayName: string) => new Promise(() => undefined),
})

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const FirebaseProvider = ({ children }: Props) => {
    const { activeTheme, setActiveTheme } = useContext(ThemeContext)
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const [claims, setClaims] = useState<[string]>()
    const [loadingClaims, setLoadingClaims] = useState(true)
    const [loadingTheme, setLoadingTheme] = useState(true)
    const [authToken, setAuthToken] = useState()
    const { showToast } = useContext(GlobalContext)
    // Setter here is being used to prevent an async race condition with component state
    const [savingTheme, setSavingTheme] = useState(false)

    // User requires the .admin token to use this function
    const getClaims = async (uid: string) => {
        const result = await callFirebaseFunction('getClaims', {
            userId: uid,
            authToken: authToken,
        })
        console.log(result.data.customClaims)
        return result.data.customClaims as UserClaims
    }

    // User requires the .admin token to use this function
    const addClaim = async (uid: string, claimName: string) => {
        const result = await callFirebaseFunction('modifyClaim', {
            userId: uid,
            authToken: authToken,
            claim: claimName,
            value: true,
        })
        return result.data
    }

    // User requires the .admin token to use this function
    const removeClaim = async (uid: string, claimName: string) => {
        const result = await callFirebaseFunction('modifyClaim', {
            userId: uid,
            authToken: authToken,
            claim: claimName,
        })
        return result.data
    }

    const updateUserToken = async () => {
        if (!currentUser) {
            setAuthToken(undefined)
            return
        }

        const token: any = await currentUser.getIdToken(true)
        setAuthToken(token)
        console.log(token)

        const { claims } = await currentUser.getIdTokenResult()
        console.log(claims)

        if (claims !== undefined) {
            const newClaims = []
            if (claims.admin === true) newClaims.push('admin')
            setClaims(newClaims as [string])
        }
        setLoadingClaims(false)
    }

    // Because of ContextType, displayName is required when being called non-locally
    const setProfile = async (displayName?: string) => {
        const currentUser = getAuth().currentUser
        if (!currentUser) return
        if (!displayName)
            displayName = currentUser.displayName as string
        const authToken = await currentUser.getIdToken()
        setSavingTheme(true)
        const promises: Promise<any>[] = []
        promises.push(currentUser.updateProfile({ displayName }))
        promises.push(callFirebaseFunction('setProfile', {
            authToken,
            displayName,
            activeTheme
        }))
        setSavingTheme(false)
        return Promise.all(promises)
    }

    // Save the current user's theme when it changes
    const getCurrentUsersTheme = async (uid: string) => {
        const snapshot = await getFirestore()
            .collection('profiles')
            .doc(uid)
            .get()
        const data = snapshot.data()
        if (data) return data.theme as Theme
        return 'Light' as Theme
    }

    useEffect(() => {
        updateUserToken()
        if (currentUser) {
            getCurrentUsersTheme(currentUser.uid).then((usersTheme: Theme) => {
                if (usersTheme && usersTheme != activeTheme)
                    setActiveTheme(usersTheme)
                setLoadingTheme(false)
            }).catch((error) => {
                console.error(error)
                setLoadingTheme(false)
            })
        }
    }, [currentUser])

    useEffect(() => {
        if (currentUser && !savingTheme) {
            getCurrentUsersTheme(currentUser.uid).then((usersTheme: Theme) => {
                if (usersTheme && usersTheme != activeTheme)
                    setProfile()
            }).catch(() => {
                setSavingTheme(false)
            })
        }
    }, [activeTheme])

    const isLoading = loadingUser || loadingClaims || loadingTheme
    const error = errorUser

    if (loadingUser)
        return <ActivityIndicator fullscreen={true} viewStyle={Styles.views.activityIndicator} />
    else if (errorUser)
        return <DisplayError permissionDenied={errorUser.code === 'permission-denied'} />
    return (
        <>
            <FirebaseNotifications currentUser={currentUser} />
            <FirebaseContext.Provider
                value={{
                    currentUser,
                    claims,
                    isLoading,
                    error,
                    addClaim,
                    removeClaim,
                    getClaims,
                    setProfile,
                    authToken,
                }}
            >
                {children}
            </FirebaseContext.Provider>
        </>
    )
}
