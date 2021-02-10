import React, { useContext } from 'react'
import { Button, TouchableOpacity } from 'react-native'
import { Text } from './Components'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../Constants'

export default ({ style, title, disabled, reactNativeButton, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)
    const properTheme = !disabled ? Themes.button[theme] : Themes.buttonDisabled[theme]

    // Use the native button
    if (reactNativeButton) {
        return (
            <Button
                title={title}
                disabled={disabled}
                style={[Styles.button.native, properTheme, style]}
                {...restProps}
            />
        )
    }
    // TouchableHighlight is another option, this works nice though
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[Styles.button.touchable, properTheme, style]}
            {...restProps}
        >
            <Text style={[properTheme, Styles.button.text]} >{title}</Text>
        </TouchableOpacity>
    )
}


