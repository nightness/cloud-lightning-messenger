import React, { createContext, useState, useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { useAuthState, callFirebaseFunction } from './Firebase'

export const FirebaseContext = createContext()

export const FirebaseProvider = ({ children }) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const [claims, setClaims] = useState({})
    const [loadingClaims, setLoadingClaims] = useState(true)
    const [errorClaims, setClaimsError] = useState()
    const [userToken, setUserToken] = useState()

    const updateToken = () => {
        if (!currentUser) {
            setUserToken(undefined)
            return
        }

        currentUser.getIdToken(true)
            .then(token => setUserToken(token))
            .catch()

        currentUser.getIdTokenResult()
            .then(idTokenResult => {
                if (idTokenResult.claims !== undefined)
                    setClaims(idTokenResult.claims)
                setLoadingClaims(false)
            })
            .catch((error) => {
                setClaimsError(error)
            })
    }

    const addClaim = async claimName => {
        callFirebaseFunction('modifyClaim', {
            userId: currentUser.uid,
            authToken: userToken,
            claim: claimName,
            value: true,
        }).then(result => {
            updateToken()
            console.log(result)
        })
    }

    const removeClaim = async claimName => {
        callFirebaseFunction('modifyClaim', {
            userId: currentUser.uid,
            authToken: userToken,
            claim: claimName,
        }).then(result => {
            updateToken()
            console.log(result)
        })
    }

    const isLoading = loadingUser || loadingClaims
    const error = errorUser || errorClaims

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
