import React, { useState, useRef, useEffect } from 'react'
import { FlatList, View } from 'react-native'
import { Styles } from '../shared/Constants'

/*
React Native Infinite Scroll; by Ben Awad
https://www.youtube.com/watch?t=237&v=WcGd8VkRc48&feature=youtu.be
*/


export default (props) => {
    const {
        onScrollProp = onScroll,
        onStartReached,
        autoScrollToEnd,
        classRef,
        refreshing,
        ...restProps
    } = props
    const flatList = useRef();
    const [yScroll, setYScroll] = useState(-1)

    useEffect(() => {
        if (classRef)
            classRef.current = flatList
    }, [flatList])

    const onScroll = (e) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
        const maxY = Math.round(contentSize.height - layoutMeasurement.height)
        const maxX = Math.round(contentSize.width - layoutMeasurement.width)

        setYScroll(contentOffset.y)
        if (onScrollProp) onScrollProp(e)
    }
    const onContentSizeChange = (e, f) => {
        if (autoScrollToEnd && !refreshing)
            flatList.scrollToEnd({ animated: false })
    }
    const onLayout = ({ nativeEvent }) => {
        if (autoScrollToEnd && !refreshing)
            flatList.scrollToEnd({ animated: false })
    }
    const onRefresh = (e) => {
        console.log(e)
    }

    useEffect(() => {
        if (yScroll === 0 && onStartReached) {
            onStartReached()
        }
    }, [yScroll])

    return (
        <View style={Styles.infiniteScroll.view}>
            <FlatList
                {...restProps}
                // initialNumToRender={25}
                ref={flatList}
                //removeClippedSubviews={true}
                //refreshing={refreshing}
                //onRefresh={onRefresh}
                onLayout={onLayout}
                onContentSizeChange={onContentSizeChange}
                onScroll={onScroll}            
            />
        </View>
    )
}
