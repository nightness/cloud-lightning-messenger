import React, { useState, useEffect, useRef, useContext } from 'react'
import { StyleSheet, FlatList, View } from 'react-native'
import { useCollection, getDocumentsDataWithId, getData } from './Firebase'
import { Themes, Styles } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import ActivityIndicator from '../themed/ActivityIndicator'
import DisplayError from '../themed/DisplayError'

// Ref: For loading more, pull small chunks https://youtu.be/WcGd8VkRc48?t=237

const getTime = () => {
    let tmpDate = new Date(Date.now())
    return tmpDate.getTime()
}

const CollectionFlatList = props => {
    const flatList = useRef()
    const { style, messages, onScrollProp = onScroll, onStartReached, autoScrollToEnd, ...restProps } = props
    const [hitTop, setHitTop] = useState(state => ({}))
    const [refreshing, setRefreshing] = useState(false)
    const { theme } = useContext(GlobalContext)

    const onScroll = (e) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
        const maxY = Math.round(contentSize.height - layoutMeasurement.height)
        const maxX = Math.round(contentSize.width - layoutMeasurement.width)

        if (contentOffset.y === 0) setHitTop({})
        if (onScrollProp) onScrollProp(e)
    }
    const onContentSizeChange = (e, f) => {
        if (autoScrollToEnd && !refreshing)
            flatList.current.scrollToEnd({ animated: false })
    }
    const onLayout = ({ nativeEvent }) => {
        if (autoScrollToEnd && !refreshing)
            flatList.current.scrollToEnd({ animated: false })
    }
    const onRefresh = (e) => {
        console.log(e)
    }
    const loadMoreMessages = () => {
        console.log("loadMoreMessages() : Start")
        setRefreshing(true)

        // each new message increases the viewLength by 1
        messengerDispatch({
            type: 'incrementViewLength',
            amount: 25
        })
        updateMessages()
    }

    React.useEffect(() => {
        typeof onStartReached === 'function' && onStartReached()
    }, [hitTop])

    return (
        <View style={[Styles.views.filletedBorderView, Themes.defaultView[theme], style]}>
            <FlatList
                {...restProps}
                ref={flatList}
                removeClippedSubviews={true}
                contentContainerStyle={Styles.views.flatList}
                data={messages}
                onStartReached={loadMoreMessages}
                onLayout={onLayout}
                onContentSizeChange={onContentSizeChange}
                onScroll={onScroll}
            />
        </View>
    )
}

export default ({ collectionPath, orderBy, initialNumToRender, ...restProps }) => {
    const [snapshot, loadingCollection, errorCollection] = useCollection(collectionPath)
    const [messages, setMessages] = useState([])
    const [loadingData, setDataLoading] = useState(true)
    const [errorData, setDataError] = useState(false)

    const fetchData = () => {
        getData(snapshot, orderBy).then((querySnapshot) => {
            setMessages(getDocumentsDataWithId(querySnapshot))
            setDataLoading(false)
        }).catch((e) => {
            setDataError(e)
        })
    }

    useEffect(() => {
        if (!loadingCollection && !errorCollection && snapshot)
            fetchData()
    }, [snapshot])

    if (errorCollection || errorData) {
        let errorCollectionCode = errorCollection ? errorCollection.code : null
        let errorDataCode = errorData ? errorData.code : null
        console.error(errorCollection)
        render = <DisplayError
            permissionDenied={(errorCollectionCode === 'permission-denied' || errorDataCode === 'permission-denied')}
            errorMessage={errorCollection ? errorCollection.message : undefined}
        />
    } else if (!loadingCollection && !loadingData) {
        return <CollectionFlatList messages={messages} {...restProps} />
    }
    return <ActivityIndicator />
}
