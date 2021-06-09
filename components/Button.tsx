import React, { useContext, useEffect } from 'react'
import { Button, StyleSheet, StyleProp, TouchableOpacity, ViewStyle, View, SafeAreaView } from 'react-native'
import Text from './Text'
import { ThemeContext } from './ThemeContext'
import { Styles } from '../app/Styles'

interface Props {
    style?: StyleProp<ViewStyle>
    title?: string
    disabled?: boolean
    reactNativeButton?: any
    onPress: () => any
    children?: JSX.Element | JSX.Element[]
}

export default ({
    style,
    title,
    disabled,
    reactNativeButton,
    onPress,
    children,
    ...restProps
}: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    const currentThemeType = getThemedComponentStyle('Button', disabled)

    // Use the native button
    if (reactNativeButton && title) {
        return (
            <SafeAreaView style={style}>
                <Button title={title} disabled={disabled} onPress={onPress} />
            </SafeAreaView>
        )
    }
    // TouchableHighlight is another option, this works nice though
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[Styles.button.touchable, currentThemeType[activeTheme], style,]}
            onPress={onPress}
            {...restProps}
        >
            {title ? <Text style={[Styles.button.text, currentThemeType[activeTheme]]}>{title}</Text> : children}
        </TouchableOpacity>
    )
}

