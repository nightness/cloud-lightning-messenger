import React, { useContext, useEffect } from 'react'
import { DocumentData, FirebaseUser, QuerySnapshot, useCollection } from './Firebase'
import { GlobalContext } from '../app/GlobalContext'

interface Props {
    currentUser?: FirebaseUser | null
}

export default ({ currentUser }: Props) => {
    const path = `/notifications/${currentUser?.uid}/webRTC`
    const [snapshot, loadingCollection, errorCollection] = useCollection(path)
    const { showToast } = useContext(GlobalContext)

    //console.log(`FirebaseNotifications: currentUid: ${currentUser?.uid}, ${path}`)

    // Listen for new notifications
    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        (snapshot as QuerySnapshot<DocumentData>).docChanges().forEach((data) => {
            //showToast({ type: 'info', text1: "title", text2: data.doc.id })
        })

    }, [snapshot])

    useEffect(() => {
        console.log(`loadingCollection == ${loadingCollection}`)
    }, [loadingCollection])

    useEffect(() => {
        console.log(`errorCollection == ${errorCollection}`)
    }, [errorCollection])

    // No visual
    return <></>
}
