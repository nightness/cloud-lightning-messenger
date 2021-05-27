import React, { useContext } from 'react'
import { ActivityIndicator, ActivityIndicatorProps, StyleProp, View, ViewStyle } from 'react-native'
import { ThemeContext } from './ThemeContext'

interface Props extends ActivityIndicatorProps {
    viewStyle?: StyleProp<ViewStyle>
}

export default ({ viewStyle, size = 'large', ...restProps }: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    return (
        <View style={[getThemedComponentStyle('ActivityIndicator')[activeTheme], viewStyle]}>
            <ActivityIndicator size={size} {...restProps} />
        </View>
    )
}
