import React, { createContext, useState, useReducer, useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { getCollection, callFirebaseFunction, useAuthState } from './Firebase'

export const FirebaseContext = createContext()

// Component export
export const FirebaseProvider = ({ children }) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const [claims, setClaims] = useState({})
    const [loadingClaims, setLoadingClaims] = useState(true)
    const [errorClaims, setClaimsError] = useState()

    useEffect(() => {
        currentUser.getIdTokenResult()
            .then(idTokenResult => {
                if (idTokenResult.claims !== undefined)
                    setClaims(idTokenResult.claims)
                setLoadingClaims(false)
            })
            .catch((error) => {
                setClaimsError(error)
            });
    }, [])

    const isLoading = loadingUser || loadingClaims
    const error = errorUser || errorClaims

    if (loadingUser)
        return <ActivityIndicator />
    else if (errorUser)
        return <DisplayError
            permissionDenied={(errorUser === 'permission-denied')}
        />
    return (
        <FirebaseContext.Provider value={{ currentUser, claims, isLoading, error }}>
            {children}
        </FirebaseContext.Provider>
    )
}
