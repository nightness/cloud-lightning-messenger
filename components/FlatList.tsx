import React, { useState, useRef, useContext, RefObject, PureComponent } from 'react'
import {
    FlatList as NativeFlatList,
    View,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ListRenderItem,
    StyleProp,
    ViewStyle,
    LayoutChangeEvent,
} from 'react-native'
import { Styles } from '../shared/Styles'
import { Theme, Themes } from '../shared/Themes'
import { GlobalContext } from '../shared/GlobalContext'

interface Props<T> {
    style?: StyleProp<ViewStyle> | object
    data: T[]
    renderItem: ListRenderItem<T>
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
    onStartReached?: () => void
    autoScrollToEnd?: boolean
}

interface State<T> {
    refreshing: boolean
}

class FlatList<T> extends PureComponent<Props<T>, State<T>> {
    static contextType = GlobalContext

    public flatList: React.RefObject<NativeFlatList<T>>

    constructor(props: Props<T>) {
        super(props)
        this.state = {
            refreshing: false,
        }
        this.flatList = React.createRef<NativeFlatList<T>>()
    }

    private onFlatListScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset } = e.nativeEvent

        if (contentOffset.y === 0 && this.props.onStartReached)
            this.props.onStartReached()
        if (this.props.onScroll) this.props.onScroll(e)
    }

    private onContentSizeChange = (w: number, h: number) => {
        if (this.props.autoScrollToEnd && !this.state.refreshing)
            this.flatList.current?.scrollToEnd({ animated: false })
    }

    private onLayout = (nativeEvent: LayoutChangeEvent) => {
        if (this.props.autoScrollToEnd && !this.state.refreshing)
            this.flatList?.current?.scrollToEnd({ animated: false })
    }

    private onRefresh = () => {
        //console.log(e)
    }

    render() {
        return (
            <View
                style={[
                    Styles.views.filletedBorderView,
                    Themes.defaultView[this.context.theme as Theme],
                    this.props.style,
                ]}
            >
                <NativeFlatList
                    ref={this.flatList}
                    renderItem={this.props.renderItem}
                    refreshing={this.state.refreshing}
                    removeClippedSubviews={true}
                    data={this.props.data}
                    onLayout={this.onLayout}
                    onContentSizeChange={this.onContentSizeChange}
                    onRefresh={this.onRefresh}
                    onScroll={this.onFlatListScroll}
                />
            </View>
        )
    }
}

export default FlatList
