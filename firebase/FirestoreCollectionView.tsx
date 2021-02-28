import React, { useState, useEffect } from 'react'
import { useCollection, getDocumentsDataWithId, getData } from './Firebase'
import ActivityIndicator from '../components/ActivityIndicator'
import DisplayError from '../components/DisplayError'
import CollectionFlatList from './CollectionFlatList'

interface Props {
    collectionPath: string
    orderBy: string
    initialNumToRender: number
}

export default ({ collectionPath, orderBy, initialNumToRender, ...restProps }: Props) => {
    const [snapshot, loadingCollection, errorCollection] = useCollection(collectionPath)
    const [messages, setMessages] = useState([])
    const [loadingData, setDataLoading] = useState(true)
    const [errorData, setDataError] = useState(false)

    const fetchData = () => {
        getData(snapshot, orderBy)
            .then((querySnapshot) => {
                setMessages(getDocumentsDataWithId(querySnapshot))
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
                    errorCollection?.code === 'permission-denied' ||
                    errorData?.code === 'permission-denied'
                }
                error={errorCollection || errorData}
            />
        )
    } else if (!loadingCollection && !loadingData) {
        return <CollectionFlatList messages={messages} {...restProps} />
    }
    return <ActivityIndicator />
}
