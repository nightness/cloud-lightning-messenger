import React, { createContext, useState, useEffect } from 'react'
import { ActivityIndicator, DisplayError } from '../components/Components'
import { useAuthState, callFirebaseFunction, getAuth } from './Firebase'

type ContextType = {
    currentUser?: firebase.User
    claims?: object
    isLoading: boolean
    error?: any
    addClaim?: (uid: string, claimName: string) => Promise<any>
    removeClaim?: (uid: string, claimName: string) => Promise<any>
    getClaims?: (uid: string) => Promise<any>
    setDisplayName?: (
        displayName: string
    ) => Promise<firebase.functions.HttpsCallableResult | undefined>
    authToken?: string
}

export const FirebaseContext = createContext<ContextType>({
    isLoading: true,
})

interface Props {
    children: JSX.Element
}

export const FirebaseProvider = ({ children }: Props) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const [claims, setClaims] = useState({})
    const [loadingClaims, setLoadingClaims] = useState(true)
    const [authToken, setAuthToken] = useState()

    // User requires the .admin token to use this function
    const getClaims = async (uid: string) => {
        const result = await callFirebaseFunction('getClaims', {
            userId: uid,
            authToken: authToken,
        })
        return result.data.customClaims
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
        if (idTokenResult.claims !== undefined) setClaims(idTokenResult.claims)
        setLoadingClaims(false)
    }

    const setDisplayName = async (displayName: string) => {
        const currentUser = getAuth().currentUser
        if (!currentUser) return
        const authToken = await currentUser.getIdToken()
        currentUser.updateProfile({ displayName })
        return await callFirebaseFunction('setDisplayName', {
            displayName,
            authToken,
        })
    }

    useEffect(() => {
        updateUserToken()
    }, [currentUser])

    const isLoading = loadingUser || loadingClaims
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
                setDisplayName,
                authToken,
            }}
        >
            {children}
        </FirebaseContext.Provider>
    )
}
