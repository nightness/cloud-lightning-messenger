import React, { useState, useEffect, useContext } from 'react'
import {
    useCollection,
    getDocumentsDataWithId,
    getData,
    DocumentData,
    QuerySnapshot,
} from './Firebase'
import ActivityIndicator from '../components/ActivityIndicator'
import DisplayError from '../components/DisplayError'
import { ListRenderItem, StyleProp, ViewStyle } from 'react-native'
import { FirebaseError } from 'firebase'
import FlatList from '../components/FlatList'
import { LinearGradient } from 'expo-linear-gradient'
import { GradientColors } from '../app/GradientColors'
import { GlobalContext } from '../app/GlobalContext'

interface Props<T> {
    style?: StyleProp<ViewStyle> | object
    collectionPath: string
    renderItem: ListRenderItem<T>
    orderBy?: string
    limitLength?: number
    initialNumToRender?: number
    autoScrollToEnd?: boolean
}

export default function _<T>({
    style,
    collectionPath,
    renderItem,
    orderBy,
    limitLength,
    initialNumToRender,
    autoScrollToEnd,
    ...restProps
}: Props<T>) {
    const [snapshot, loadingCollection, errorCollection] = useCollection(collectionPath)
    const [messages, setMessages] = useState([])
    const [loadingData, setDataLoading] = useState(true)
    const [errorData, setDataError] = useState(false)
    const { theme } = useContext(GlobalContext)

    const fetchData = () => {
        const querySnapshot = snapshot as QuerySnapshot<DocumentData>
        getData(querySnapshot, orderBy, limitLength)
            .then((documentRef) => {
                // @ts-ignore
                setMessages(getDocumentsDataWithId(documentRef))
                setDataLoading(false)
            })
            .catch((e) => {
                setDataError(e)
            })
    }

    const loadMoreMessages = () => {
        console.log('loadMoreMessages() : Start')
        //setRefreshing(true)
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
            <LinearGradient
                colors={GradientColors[theme].secondary}
                style={{ flex: 1 }}
            >

                <FlatList<T>
                    renderItem={renderItem}
                    style={style}
                    data={messages}
                    onStartReached={loadMoreMessages}
                    autoScrollToEnd={autoScrollToEnd}
                    {...restProps}
                />
            </LinearGradient>
        )
    }
    return <ActivityIndicator />
}
