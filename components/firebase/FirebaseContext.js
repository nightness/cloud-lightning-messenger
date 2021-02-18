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
    const addClaim = async claimName => {
        const result = await callFirebaseFunction('modifyClaim', {
            userId: currentUser.uid,
            authToken: userToken,
            claim: claimName,
            value: true,
        })
        updateToken()
        console.log(result)
        return result
    }

    // User requires the .admin token to use this function
    const removeClaim = async claimName => {
        const result = await callFirebaseFunction('modifyClaim', {
            userId: currentUser.uid,
            authToken: userToken,
            claim: claimName,
        })
        updateToken()
        console.log(result)
        return result
    }

    const updateToken = async () => {
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

    const isLoading = loadingUser || loadingClaims
    const error = errorUser

    useEffect(() => {
        updateToken()
    }, [currentUser])

    useEffect(() => {
        console.log(userToken)
    }, [userToken])

    if (loadingUser)
        return <ActivityIndicator />
    else if (errorUser)
        return <DisplayError
            permissionDenied={(errorUser === 'permission-denied')}
        />
    return (
        <FirebaseContext.Provider value={{ currentUser, claims, isLoading, error, addClaim, removeClaim, userToken }}>
            {children}
        </FirebaseContext.Provider>
    )
}
