import { auth } from 'firebase'
import React, { createContext, useState, useEffect, useRef } from 'react'
import { useAuthState, getCurrentUser, getCollection, useCollection } from '../firebase/Firebase'

export const ProfileContext = createContext()

export const useProfiler = () => {
    const [snapshot, loadingCollection, errorCollection] = useCollection('profiles')
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

    const getUserProfile = async (userId) => {
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
            const profile = await getUserProfile(fetchUidRef.current)
            newCache[fetchUidRef.current] = profile
            isFetchingRef.current = false
        }
        if (newCache)
            setCachedUsers(newCache)
        setIsFetching(false)
    }

    function getUserName(uid) {
        if (!currentUser) return ''
        if (!uid) uid = currentUser.uid
        if (cachedUsers[uid] && cachedUsers[uid].displayName)
            return cachedUsers[uid].displayName
        else if (!cachedUsers[uid])
            fetchUser(uid)
        return ''
    }

    useEffect(() => {
        const username = getUserName()
        if (username) {
            setIsLoadingProfile(false)
        }
        else {
            hasProfile().then(hasProfile => {
                if (hasProfile) {
                    setIsLoadingProfile(false)
                }
            })
        }
    }, [cachedUsers])

    useEffect(() => {
        if (!snapshot) return

        snapshot.docChanges().forEach(documentChange => {
            if (cachedUsers[documentChange.doc.id])
                fetchUser(documentChange.doc.id, true)
            //console.log(documentChange.doc.id)
        })
    }, [snapshot])

    return {
        cachedUsers,
        fetchUser,
        isFetching: isFetching || loading || isLoadingProfile,
        getUserName,
        hasProfile,
        error
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
