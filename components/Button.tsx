import React, { useContext } from 'react'
import { Button, StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import { Text } from './Components'
import { GlobalContext } from '../app/GlobalContext'
import { Styles } from '../app/Styles'
import { Themes } from '../app/Themes'

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
    const { theme } = useContext(GlobalContext)
    const properTheme = !disabled ? Themes.button[theme] : Themes.buttonDisabled[theme]

    // Use the native button
    if (reactNativeButton && title) {
        return <Button title={title} disabled={disabled} onPress={onPress} />
    }
    // TouchableHighlight is another option, this works nice though
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[Styles.button.touchable, properTheme, style]}
            onPress={onPress}
            {...restProps}
        >
            { title ? <Text style={[properTheme, Styles.button.text]}>{title}</Text> : children }
        </TouchableOpacity>
    )
}
