import React, { createContext, useState, useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { useAuthState } from './Firebase'

export const FirebaseContext = createContext()

// Provider export
export const FirebaseProvider = ({ children }) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const [claims, setClaims] = useState({})
    const [loadingClaims, setLoadingClaims] = useState(true)
    const [errorClaims, setClaimsError] = useState()

    useEffect(() => {
        if (currentUser)
            currentUser.getIdTokenResult()
                .then(idTokenResult => {
                    if (idTokenResult.claims !== undefined)
                        setClaims(idTokenResult.claims)
                    setLoadingClaims(false)
                })
                .catch((error) => {
                    setClaimsError(error)
                });
    }, [currentUser])

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
