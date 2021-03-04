import React, { StyleHTMLAttributes } from 'react'
import { Styles } from '../shared/Styles'
import View from './View'
import Switch from './Switch'
import Text from './Text'
import { ActivityIndicator, StyleProp, TextStyle, ViewStyle } from 'react-native'

interface Props {
    label: string
    style?: StyleProp<ViewStyle>
    loadingIndicatorStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    value: boolean
    isLoading: boolean
    onChange: () => void
}

export default ({
    label,
    style,
    textStyle,
    loadingIndicatorStyle,
    isLoading,
    value,
    onChange,
    ...restProps
}: Props) => {
    return (
        <View style={[Styles.views.flexRowJustifyCenter, style]}>
            {label ? (
                <Text style={[{ marginRight: 10 }, textStyle]}>{label}</Text>
            ) : (
                <></>
            )}
            {isLoading ? (
                <ActivityIndicator style={loadingIndicatorStyle} {...restProps} />
            ) : (
                <Switch value={value} {...restProps} />
            )}
        </View>
    )
}
