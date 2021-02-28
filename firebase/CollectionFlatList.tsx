import React, { useState, useRef, useContext, RefObject } from 'react'
import { FlatList, View, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import { GlobalContext } from '../shared/GlobalContext'
import Message from '../messenger/Message'

interface CollectionFlatListProps {
    style?: any
    messages: Message[]
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
    onStartReached?: () => void
    autoScrollToEnd?: boolean
}

export default ({
    style,
    messages,
    onScroll,
    onStartReached,
    autoScrollToEnd,
    ...restProps
}: CollectionFlatListProps) => {
    const flatList = useRef<RefObject<FlatList<any>>>()
    const [hitTop, setHitTop] = useState((state) => ({}))
    const [refreshing, setRefreshing] = useState(false)
    const { theme } = useContext(GlobalContext)

    const onFlatListScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
        const maxY = Math.round(contentSize.height - layoutMeasurement.height)
        const maxX = Math.round(contentSize.width - layoutMeasurement.width)

        if (contentOffset.y === 0) setHitTop({})
        typeof onScroll === 'function' && onScroll(e)
    }
    const onContentSizeChange = (w: number, h: number) => {
        if (autoScrollToEnd && !refreshing)
            flatList.current.scrollToEnd({ animated: false })
    }
    const onLayout = () => {
        if (autoScrollToEnd && !refreshing)
            flatList.current.scrollToEnd({ animated: false })
    }
    const onRefresh = (e) => {
        //console.log(e)
    }
    const loadMoreMessages = () => {
        console.log('loadMoreMessages() : Start')
        //setRefreshing(true)
    }

    React.useEffect(() => {
        typeof onStartReached === 'function' && onStartReached()
    }, [hitTop])

    return (
        <View style={[Styles.views.filletedBorderView, Themes.defaultView[theme], style]}>
            <FlatList
                {...restProps}
                ref={flatList.current}
                removeClippedSubviews={true}
                contentContainerStyle={Styles.views.flatList}
                data={messages}
                onStartReached={loadMoreMessages}
                onLayout={onLayout}
                onContentSizeChange={onContentSizeChange}
                onScroll={onFlatListScroll}
            />
        </View>
    )
}
