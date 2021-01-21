import React, { createContext, useState, useEffect, useRef } from 'react'
import { useAuthState, getCurrentUser, getCollection } from '../firebase/Firebase'

export const ProfileContext = createContext()

export const useProfiler = () => {
    const [cachedUsers, setCachedUsers] = useState({})
    const [currentUser, loading, error] = useAuthState();
    const [isFetching, setIsFetching] = useState(true)
    const isFetchingRef = useRef(false)
    const fetchUidRef = useRef(null)
    const lookupQueueRef = useRef([])

    const getUserProfile = async (userId) => {
        if (!userId) {
            const currentUser = getCurrentUser()
            userId = currentUser ? currentUser.uid : null
        }
        const docRef = await getCollection("users").doc(userId).get()
        if (docRef.exists) {
            const docData = docRef.data()
            return docData
        }
        return {}
    }

    const fetchUser = async userId => {
        if (!userId || cachedUsers[userId] ||
            (isFetchingRef.current && fetchUidRef.current === userId))
            return
        if (userId)
            lookupQueueRef.current.push(userId)
        if (isFetchingRef.current) return

        let newCache = null
        while (lookupQueueRef.current.length > 0) {
            if (!newCache) {
                newCache = { ...cachedUsers }
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
        if (currentUser)
            getUserName(currentUser.uid)
    }, [currentUser]);

    return {
        cachedUsers,
        fetchUser,
        isFetching: isFetching || loading,
        getUserName,
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
