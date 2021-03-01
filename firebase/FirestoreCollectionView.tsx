import React, { useState, useEffect } from 'react'
import {
    useCollection,
    getDocumentsDataWithId,
    getData,
    DocumentData,
    QuerySnapshot,
} from './Firebase'
import ActivityIndicator from '../components/ActivityIndicator'
import DisplayError from '../components/DisplayError'
import CollectionFlatList from './CollectionFlatList'
import { ListRenderItem } from 'react-native'
import { FirebaseError } from 'firebase'

interface Props<T> {
    collectionPath: string
    renderItem: ListRenderItem<T>
    orderBy?: string
    initialNumToRender?: number
    autoScrollToEnd?: boolean
}

export default ({
    collectionPath,
    renderItem,
    orderBy,
    initialNumToRender,
    autoScrollToEnd,
    ...restProps
}: Props<any>) => {
    const [snapshot, loadingCollection, errorCollection] = useCollection(collectionPath)
    const [messages, setMessages] = useState([])
    const [loadingData, setDataLoading] = useState(true)
    const [errorData, setDataError] = useState(false)

    const fetchData = () => {
        const querySnapshot = snapshot as QuerySnapshot<DocumentData>
        getData(querySnapshot, orderBy)
            .then((documentRef) => {
                // @ts-ignore
                setMessages(getDocumentsDataWithId(documentRef))
                setDataLoading(false)
            })
            .catch((e) => {
                setDataError(e)
            })
    }

    useEffect(() => {
        if (!loadingCollection && !errorCollection && snapshot) fetchData()
    }, [snapshot])

    if (errorCollection || errorData) {
        return (
            <DisplayError
                permissionDenied={
                    (errorCollection as FirebaseError)?.code === 'permission-denied'
                }
                error={errorCollection || errorData}
            />
        )
    } else if (!loadingCollection && !loadingData) {
        return (
            <CollectionFlatList
                renderItem={renderItem}
                messages={messages}
                autoScrollToEnd={autoScrollToEnd}
                {...restProps}
            />
        )
    }
    return <ActivityIndicator />
}
