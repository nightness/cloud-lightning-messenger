import React, { useState, useEffect, useMemo, useRef } from 'react'
import { StyleSheet, FlatList, VirtualizedList, ScrollView, View, AppLoading } from 'react-native'
import { useDocumentData } from './Firebase'
import ActivityIndicator from '../common/ActivityIndicator'
import DisplayError from '../common/DisplayError'
import Text from '../common/Text'

const DocumentFlatList = props => {
    const flatList = useRef()
    const { data, onScrollProp = onScroll, onStartReached, autoScrollToEnd, ...restProps } = props;
    const [yScroll, setYScroll] = useState(-1)

    const onScroll = (e) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
        const maxY = Math.round(contentSize.height - layoutMeasurement.height)
        const maxX = Math.round(contentSize.width - layoutMeasurement.width)

        setYScroll(contentOffset.y)
        if (onScrollProp) onScrollProp(e)
    }
    const onContentSizeChange = (e, f) => {
        if (autoScrollToEnd && !refreshing)
            flatList.current.scrollToEnd({ animated: false })
    }
    const onLayout = ({ nativeEvent }) => {
        const { layout, target } = nativeEvent
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
        if (yScroll === 0 && onStartReached) {
            onStartReached()
        }
    }, [yScroll])

    return (
        <View style={styles.view}>
            <FlatList
                {...restProps}
                ref={flatList}
                data={data}
                onStartReached={loadMoreMessages}
                onLayout={onLayout}
                onContentSizeChange={onContentSizeChange}
                onScroll={onScroll}
                onRefresh={onRefresh}
                refreshing={refreshing}
                removeClippedSubviews={true}
                contentContainerStyle={styles.flatlist}
            />
        </View>
    )
}

export default ({ documentPath, orderBy, initialNumToRender, ...restProps }) => {
    const [data, loadingData, errorData] = useDocumentData(documentPath)

    let render = <ActivityIndicator />
    if (errorData) {
        let errorDataCode = errorData ? errorData.code : null
        render =
            <DisplayError
                permissionDenied={(errorDataCode === 'permission-denied')}
            />
    } else if (!loadingData) {
        render =
            <DocumentFlatList data={data.recentMessages} {...restProps} />
    }
    return (
        <>{render}</>
    )

}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        margin: 5,
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#48a",
        width: "100%"
    }
})