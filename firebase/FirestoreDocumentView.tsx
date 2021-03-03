import React from 'react'
import { useDocumentData } from './Firebase'
import ActivityIndicator from '../components/ActivityIndicator'
import DisplayError from '../components/DisplayError'
import { ListRenderItem, StyleProp, ViewStyle } from 'react-native'
import FlatList from '../components/FlatList'
import Message from '../messenger/Message'
import { FirebaseError } from 'firebase'

interface Props<T> {
    style: StyleProp<ViewStyle> | object
    documentPath: string
    renderItem: ListRenderItem<T>
    orderBy?: string
    initialNumToRender?: number
    autoScrollToEnd?: boolean
}

export default ({
    style,
    documentPath,
    renderItem,
    orderBy,
    initialNumToRender,
    autoScrollToEnd,
    ...restProps
}: Props<Message>) => {
    const [document, loadingDocument, errorDocument] = useDocumentData(documentPath)

    const loadMoreMessages = () => {
        console.log('loadMoreMessages() : Start')
        //setRefreshing(true)
    }

    if (loadingDocument) return <ActivityIndicator />

    if (errorDocument) {
        return (
            <DisplayError
                permissionDenied={
                    (errorDocument as FirebaseError)?.code === 'permission-denied'
                }
                error={errorDocument}
            />
        )
    }

    return (
        <FlatList
            renderItem={renderItem}
            //@ts-ignore
            data={document.recentMessages}
            onStartReached={loadMoreMessages}
            {...restProps}
        />
    )
}
