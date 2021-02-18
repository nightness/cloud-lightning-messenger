import React, { createContext, useState, useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { useAuthState, callFirebaseFunction } from './Firebase'

export const FirebaseContext = createContext()

export const FirebaseProvider = ({ children }) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const [claims, setClaims] = useState({})
    const [loadingClaims, setLoadingClaims] = useState(true)
    const [userToken, setUserToken] = useState()

    // User requires the .admin token to use this function
    const getClaims = async uid => {
        const result = await callFirebaseFunction('getClaims', {
            userId: uid,
            authToken: userToken,
        })
        return result.data.customClaims
    }

    // User requires the .admin token to use this function
    const addClaim = async (uid, claimName) => {
        const result = await callFirebaseFunction('modifyClaim', {
            userId: uid,
            authToken: userToken,
            claim: claimName,
            value: true,
        })
        console.log(result)
        return result
    }

    // User requires the .admin token to use this function
    const removeClaim = async (uid, claimName) => {
        const result = await callFirebaseFunction('modifyClaim', {
            userId: uid,
            authToken: userToken,
            claim: claimName,
        })
        console.log(result)
        return result
    }

    const updateUserToken = async uid => {
        if (!currentUser) {
            setUserToken(undefined)
            return
        }

        const token = await currentUser.getIdToken(true)
        setUserToken(token)

        const idTokenResult = await currentUser.getIdTokenResult()
        if (idTokenResult.claims !== undefined)
            setClaims(idTokenResult.claims)
        setLoadingClaims(false)
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
            currentUser, claims, isLoading, error, addClaim, removeClaim, getClaims, userToken
        }}>
            {children}
        </FirebaseContext.Provider>
    )
}
