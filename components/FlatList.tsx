import React, { useState, useRef, useContext, RefObject } from 'react'
import {
    FlatList,
    View,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ListRenderItem,
    StyleProp,
    ViewStyle,
    LayoutChangeEvent,
} from 'react-native'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import { GlobalContext } from '../shared/GlobalContext'
import Message from '../messenger/Message'

interface FlatListProps<T> {
    style?: StyleProp<ViewStyle> | object
    data: T[]
    renderItem: ListRenderItem<T>
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
    onStartReached?: () => void
    autoScrollToEnd?: boolean
}

export default ({
    style,
    data,
    renderItem,
    onScroll,
    onStartReached,
    autoScrollToEnd,
    ...restProps
}: FlatListProps<Message>) => {
    const flatList = useRef<any>()
    const [refreshing, setRefreshing] = useState(false)
    const { theme } = useContext(GlobalContext)

    const onFlatListScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
        const maxY = Math.round(contentSize.height - layoutMeasurement.height)
        const maxX = Math.round(contentSize.width - layoutMeasurement.width)

        if (contentOffset.y === 0 && onStartReached) onStartReached()
        typeof onScroll === 'function' && onScroll(e)
    }
    const onContentSizeChange = (w: number, h: number) => {
        if (autoScrollToEnd && !refreshing)
            flatList.current?.scrollToEnd({ animated: false })
    }
    const onLayout = (nativeEvent: LayoutChangeEvent) => {
        if (autoScrollToEnd && !refreshing)
            flatList.current?.scrollToEnd({ animated: false })
    }
    const onRefresh = () => {
        //console.log(e)
    }

    return (
        <View style={[Styles.views.filletedBorderView, Themes.defaultView[theme], style]}>
            <FlatList
                {...restProps}
                ref={flatList}
                renderItem={renderItem}
                refreshing={refreshing}
                removeClippedSubviews={true}
                data={data}
                onLayout={onLayout}
                onContentSizeChange={onContentSizeChange}
                onRefresh={onRefresh}
                onScroll={onFlatListScroll}
            />
        </View>
    )
}
