import { auth } from 'firebase'
import React, { createContext, useState, useEffect, useRef } from 'react'
import { useAuthState, getCurrentUser, getCollection, useCollection } from '../firebase/Firebase'

export const ProfileContext = createContext()

const sleep = async delay => await new Promise(r => setTimeout(r, delay));

export const useProfiler = () => {
    const [snapshot, setSnapshot] = useState()
    const [isLoadingCollection, setIsLoadingCollection] = useState(true)
    const [collectionError, setCollectionError] = useState()
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)
    const [cachedUsers, setCachedUsers] = useState({})
    const [currentUser, loading, error] = useAuthState();
    const [isFetching, setIsFetching] = useState(true)
    const isFetchingRef = useRef(false)
    const fetchUidRef = useRef(null)
    const lookupQueueRef = useRef([])

    const hasProfile = async userId => {
        if (!userId) {
            const currentUser = getCurrentUser()
            userId = currentUser ? currentUser.uid : null
        }
        if (!userId) return false
        if (cachedUsers[userId]) return true
        const docRef = await getCollection('profiles').doc(userId).get()
        return docRef.exists
    }

    const getUserProfile = async userId => {
        if (!userId) {
            const currentUser = getCurrentUser()
            userId = currentUser ? currentUser.uid : null
        }
        const docRef = await getCollection('profiles').doc(userId).get()
        if (docRef.exists) {
            const docData = docRef.data()
            return docData
        }
        return {}
    }

    const fetchUser = async (userId, forced = false) => {
        if (!userId || (cachedUsers[userId] && !forced) ||
            (isFetchingRef.current && fetchUidRef.current === userId))
            return
        if (userId)
            lookupQueueRef.current.push(userId)
        if (isFetchingRef.current) return

        let newCache = null
        while (lookupQueueRef.current.length > 0) {
            if (!newCache) {
                newCache = { ...cachedUsers }
                if (!forced)
                    setIsFetching(true)
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

                /**
                    FirebaseError: Missing or insufficient permissions.
                        at new e (http://localhost:19006/static/js/bundle.js:30324:5382)
                        at t.ti (http://localhost:19006/static/js/bundle.js:30324:84533)
                        at t.Di (http://localhost:19006/static/js/bundle.js:30324:93181)
                        at e.onMessage (http://localhost:19006/static/js/bundle.js:30324:213728)
                        at http://localhost:19006/static/js/bundle.js:30324:212394
                        at http://localhost:19006/static/js/bundle.js:30324:213279
                        at http://localhost:19006/static/js/bundle.js:30324:109564
                    ProfileContext.js:63 Starting fetchUser for {userId}
                    ProfileContext.js:128 FirebaseError: Missing or insufficient permissions.
                        at new e (http://localhost:19006/static/js/bundle.js:30324:5382)
                        at t.ti (http://localhost:19006/static/js/bundle.js:30324:84533)
                        at t.Di (http://localhost:19006/static/js/bundle.js:30324:93181)
                        at e.onMessage (http://localhost:19006/static/js/bundle.js:30324:213728)
                        at http://localhost:19006/static/js/bundle.js:30324:212394
                        at http://localhost:19006/static/js/bundle.js:30324:213279
                        at http://localhost:19006/static/js/bundle.js:30324:109564

                 */
                await sleep(2000)
                console.log(err)
            }
            isFetchingRef.current = false
        }
        if (newCache)
            setCachedUsers(newCache)
        setIsFetching(false)
    }

    const getUserName = uid => {
        if (!currentUser) return ''
        if (!uid) uid = currentUser.uid
        if (cachedUsers[uid] && cachedUsers[uid].displayName)
            return cachedUsers[uid].displayName
        else if (!cachedUsers[uid])
            fetchUser(uid)
        return ''
    }

    const verifyAccess = async () => {
        var hasAccess = false
        var retryCount = 0
        var exception
        while (!hasAccess && retryCount < 10) {
            await new Promise(resolve => setTimeout(resolve, 500))
            try {
                const profiles = getCollection('profiles')
                await profiles.get()
                hasAccess = true
            } catch (err) {
                retryCount = retryCount + 1
                exception = err
                console.log(err)
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
        const username = getUserName()
        if (username) {
            setIsLoadingProfile(false)
        }
        else {
            hasProfile()
                .then(hasProfile => {
                    if (hasProfile) {
                        setIsLoadingProfile(false)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [cachedUsers])

    useEffect(() => {
        if (!snapshot) return

        try {
            snapshot.docChanges().forEach(documentChange => {
                if (cachedUsers[documentChange.doc.id])
                    fetchUser(documentChange.doc.id, true)
            })
        } catch (err) {
            console.log(err)
        }
    }, [snapshot])

    return {
        cachedUsers,
        fetchUser,
        isFetching: isFetching || loading || isLoadingProfile || isLoadingCollection,
        getUserName,
        hasProfile,
        getUserProfile,
        error: error || collectionError
    }
}

// Profile Provider
export const ProfileProvider = ({ children }) => {
    const profiler = useProfiler()
    return (
        <ProfileContext.Provider value={profiler}>
            {children}
        </ProfileContext.Provider>
    )
}
