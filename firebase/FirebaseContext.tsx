import React, { createContext, useState, useEffect, useContext } from 'react'
import { ActivityIndicator, DisplayError } from '../components/Components'
import { UserClaims } from './DataTypes'
import { useAuthState, callFirebaseFunction, getAuth, getFirestore } from './Firebase'
import { GlobalContext } from '../shared/GlobalContext'
import { Theme } from '../shared/Themes'

type ContextType = {
    currentUser?: firebase.User
    claims: UserClaims
    isLoading: boolean
    error?: any
    authToken?: string
    addClaim: (uid: string, claimName: string) => Promise<any>
    removeClaim: (uid: string, claimName: string) => Promise<any>
    getClaims: (uid: string) => Promise<any>
    setProfileAttribute: (displayName: string) => Promise<any>
}

export const FirebaseContext = createContext<ContextType>({
    claims: {
        admin: false,
        manager: false,
        moderator: false,
    },
    isLoading: true,
    addClaim: (uid: string, claimName: string) => new Promise(() => undefined),
    removeClaim: (uid: string, claimName: string) => new Promise(() => undefined),
    getClaims: (uid: string) => new Promise(() => undefined),
    setProfileAttribute: (displayName: string) => new Promise(() => undefined),
})

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const FirebaseProvider = ({ children }: Props) => {
    const { theme, setTheme } = useContext(GlobalContext)
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const [claims, setClaims] = useState<UserClaims>({
        admin: false,
        manager: false,
        moderator: false,
    })
    const [loadingClaims, setLoadingClaims] = useState(true)
    const [loadingTheme, setLoadingTheme] = useState(true)
    const [authToken, setAuthToken] = useState()

    // Setter here is being used to prevent an async race condition with component state
    const [savingTheme, setSavingTheme] = useState(false)

    // User requires the .admin token to use this function
    const getClaims = async (uid: string) => {
        const result = await callFirebaseFunction('getClaims', {
            userId: uid,
            authToken: authToken,
        })
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

        const idTokenResult = await currentUser.getIdTokenResult()
        if (idTokenResult.claims !== undefined)
            setClaims(idTokenResult.claims as UserClaims)
        setLoadingClaims(false)
    }

    // Because of ContextType, displayName is required when being called non-locally
    const setProfileAttribute = async (displayName?: string) => {
        const currentUser = getAuth().currentUser
        if (!currentUser) return
        if (!displayName)
            displayName = currentUser.displayName as string
        const authToken = await currentUser.getIdToken()
        setSavingTheme(true)
        currentUser.updateProfile({ displayName })
        const result = await callFirebaseFunction('setProfileAttribute', {            
            authToken,
            displayName,
            theme
        })
        setSavingTheme(false)
        return result
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
                if (usersTheme && setTheme && usersTheme != theme)
                    setTheme(usersTheme)
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
                if (usersTheme && setTheme && usersTheme != theme)
                    setProfileAttribute()
            }).catch(() => {                
                setSavingTheme(false)
            })
        }        
    }, [theme])

    const isLoading = loadingUser || loadingClaims || loadingTheme
    const error = errorUser

    if (loadingUser) return <ActivityIndicator />
    else if (errorUser)
        return <DisplayError permissionDenied={errorUser.code === 'permission-denied'} />
    return (
        <FirebaseContext.Provider
            value={{
                currentUser,
                claims,
                isLoading,
                error,
                addClaim,
                removeClaim,
                getClaims,
                setProfileAttribute,
                authToken,
            }}
        >
            {children}
        </FirebaseContext.Provider>
    )
}
