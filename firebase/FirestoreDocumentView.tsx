import React from 'react'
import { useDocumentData } from './Firebase'
import ActivityIndicator from '../components/ActivityIndicator'
import DisplayError from '../components/DisplayError'
import { ListRenderItem, StyleProp, ViewStyle } from 'react-native'
import FlatList from '../components/FlatList'
import { FirebaseError } from 'firebase'
import Message from '../messenger/Message'

interface Props<T> {
    style: StyleProp<ViewStyle> | object
    documentPath: string
    renderItem: ListRenderItem<T>
    orderBy?: string
    initialNumToRender?: number
    autoScrollToEnd?: boolean
}

export default function _<T>({
    style,
    documentPath,
    renderItem,
    orderBy,
    initialNumToRender,
    autoScrollToEnd,
    ...restProps
}: Props<T>) {
    const [document, loadingDocument, errorDocument] = useDocumentData(documentPath)

    const loadMore = () => {
        console.log('loadMore() : Start')
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
        <FlatList<T>
            renderItem={renderItem}
            //@ts-ignore
            data={document.recentMessages}
            onStartReached={loadMore}
            {...restProps}
        />
    )
}
