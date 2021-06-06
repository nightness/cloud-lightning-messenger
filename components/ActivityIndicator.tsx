import { LinearGradient } from 'expo-linear-gradient'
import React, { useContext } from 'react'
import { ActivityIndicator, ActivityIndicatorProps, StyleProp, View, ViewStyle } from 'react-native'
import { GradientColors } from '../app/GradientColors'
import { ThemeContext } from './ThemeContext'

interface Props extends ActivityIndicatorProps {
    viewStyle?: StyleProp<ViewStyle>
    fullscreen?: boolean
}

export default ({ fullscreen, viewStyle, size = 'large', ...restProps }: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    const background = GradientColors[activeTheme].background

    if (fullscreen && background)
        return (
            <LinearGradient style={{ flex: 1, justifyContent: 'center' }} colors={background}>
                <ActivityIndicator size={size} {...restProps} />
            </LinearGradient>
        )

    return (
        <View style={[
            getThemedComponentStyle('ActivityIndicator')[activeTheme],
            viewStyle
        ]}>
            <ActivityIndicator size={size} {...restProps} />
        </View>
    )
}
