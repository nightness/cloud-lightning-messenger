import React, { createContext, useState, useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { useAuthState, callFirebaseFunction, getAuth } from './Firebase'

export const FirebaseContext = createContext()

export const FirebaseProvider = ({ children }) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const [claims, setClaims] = useState({})
    const [loadingClaims, setLoadingClaims] = useState(true)
    const [authToken, setAuthToken] = useState()

    // User requires the .admin token to use this function
    const getClaims = async uid => {
        const result = await callFirebaseFunction('getClaims', {
            userId: uid,
            authToken: authToken,
        })
        return result.data.customClaims
    }

    // User requires the .admin token to use this function
    const addClaim = async (uid, claimName) => {
        const result = await callFirebaseFunction('modifyClaim', {
            userId: uid,
            authToken: authToken,
            claim: claimName,
            value: true,
        })
        return result.data
    }

    // User requires the .admin token to use this function
    const removeClaim = async (uid, claimName) => {
        const result = await callFirebaseFunction('modifyClaim', {
            userId: uid,
            authToken: authToken,
            claim: claimName,
        })
        return result.data
    }

    const updateUserToken = async uid => {
        if (!currentUser) {
            setAuthToken(undefined)
            return
        }

        const token = await currentUser.getIdToken(true)
        setAuthToken(token)

        const idTokenResult = await currentUser.getIdTokenResult()
        if (idTokenResult.claims !== undefined)
            setClaims(idTokenResult.claims)
        setLoadingClaims(false)
    }

    const setDisplayName = async displayName => {
        const auth = getAuth()
        const authToken = await auth.currentUser.getIdToken()
        auth.currentUser.updateProfile({ displayName })
        return await callFirebaseFunction('setDisplayName', {
            displayName,
            authToken
        })
    }

    useEffect(() => {
        updateUserToken()
    }, [currentUser])

    const isLoading = loadingUser || loadingClaims
    const error = errorUser

    if (loadingUser)
        return <ActivityIndicator />
    else if (errorUser)
        return <DisplayError
            permissionDenied={(errorUser === 'permission-denied')}
        />
    return (
        <FirebaseContext.Provider value={{
            currentUser, claims, isLoading, error, addClaim, removeClaim, getClaims, setDisplayName, authToken
        }}>
            {children}
        </FirebaseContext.Provider>
    )
}
