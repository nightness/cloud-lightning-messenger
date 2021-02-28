import { auth } from 'firebase'
import React, { createContext, useState, useEffect, useRef } from 'react'
import {
    useAuthState,
    getCurrentUser,
    getCollection,
    useCollection,
} from '../firebase/Firebase'

type ContextType = {
    cachedUsers?: object
    fetchUser?: (userId: string) => string
    isFetching?: boolean
    getUserName?: (userId: string) => string
    hasProfile?: (userId: string) => Promise<boolean>
    getUserProfile?: (userId: string) => string
    error?: any | null | undefined
}

export const ProfileContext = createContext<ContextType>({})

const sleep = async (delay: number) => await new Promise((r) => setTimeout(r, delay))

export const useProfiler = () => {
    const [isLoadingCollection, setIsLoadingCollection] = useState(true)
    const [collectionError, setCollectionError] = useState()
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)
    const [cachedUsers, setCachedUsers] = useState({})
    const [currentUser, loading, error] = useAuthState()
    const [isFetching, setIsFetching] = useState(true)
    const isFetchingRef = useRef(false)
    const fetchUidRef = useRef<string>('')
    const lookupQueueRef = useRef<Array<string>>(new Array<string>())

    const hasProfile = async (userId: string) => {
        if (cachedUsers) return true
        const docRef = await getCollection('profiles').doc(userId).get()
        return docRef.exists
    }

    const getUserProfile = async (userId: string) => {
        const docRef = await getCollection('profiles').doc(userId).get()
        if (docRef.exists) {
            const docData = docRef.data()
            return docData
        }
        return {}
    }

    const fetchUser = async (userId: string, forced = false) => {
        if (
            !userId ||
            (cachedUsers?.[userId] && !forced) ||
            (isFetchingRef.current && fetchUidRef.current === userId)
        )
            return
        if (userId) lookupQueueRef.current.push(userId)
        if (isFetchingRef.current) return

        let newCache = null
        while (lookupQueueRef.current.length > 0) {
            if (!newCache) {
                newCache = { ...cachedUsers }
                if (!forced) setIsFetching(true)
            }
            fetchUidRef.current = lookupQueueRef.current.shift()

            if (!isFetchingRef.current) {
                isFetchingRef.current = true
            }
            console.log(`Starting fetchUser for ${fetchUidRef.current}`)
            try {
                const profile = await getUserProfile(fetchUidRef.current)
                newCache[fetchUidRef.current] = profile
            } catch (err) {
                // This can happen because of the security rule that requires a user to have a profile
                // document with their uid to have access to the database. Since this document is created
                // by cloud functions, a new user's first sign-in may have these permission-denied exceptions.

                /** FirebaseError: Missing or insufficient permissions. */

                // Refactoring should actually prevent this error now
                await sleep(2000)
                console.error(err)
            }
            isFetchingRef.current = false
        }
        if (newCache) setCachedUsers(newCache)
        setIsFetching(false)
    }

    const getUserName = (uid: string | undefined) => {
        if (!currentUser) return ''
        if (!uid) uid = currentUser.uid
        if (cachedUsers[uid] && cachedUsers[uid].displayName)
            return cachedUsers[uid].displayName
        else if (!cachedUsers[uid]) fetchUser(uid)
        return ''
    }

    const verifyAccess = async () => {
        var hasAccess = false
        var retryCount = 0
        var exception
        while (!hasAccess && retryCount < 10) {
            await new Promise((resolve) => setTimeout(resolve, 500))
            try {
                const profiles = getCollection('profiles')
                await profiles.get()
                hasAccess = true
            } catch (err) {
                retryCount = retryCount + 1
                exception = err
                console.error(err)
            }
        }
        setIsLoadingCollection(false)
        if (!hasAccess)
            setCollectionError(exception ? exception : new Error('permission-denied'))
    }
    // On component mounted
    useEffect(() => {
        //verifyAccess()
        setIsLoadingCollection(false)
    }, [])

    useEffect(() => {
        const username = getUserName(currentUser?.uid)
        if (username) {
            setIsLoadingProfile(false)
        } else {
            hasProfile(currentUser?.uid)
                .then((hasProfile) => {
                    if (hasProfile) {
                        setIsLoadingProfile(false)
                    }
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }, [cachedUsers])

    return {
        cachedUsers,
        fetchUser,
        isFetching: isFetching || loading || isLoadingProfile || isLoadingCollection,
        getUserName,
        hasProfile,
        getUserProfile,
        error: error || collectionError,
    }
}

// Profile Provider
export const ProfileProvider = ({ children }) => {
    const profiler = useProfiler()
    return <ProfileContext.Provider value={profiler}>{children}</ProfileContext.Provider>
}
