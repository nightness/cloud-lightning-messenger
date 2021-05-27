import React, { useContext } from 'react'
import { TextInput, TextInputProps, Keyboard, StyleSheet } from 'react-native'
import { ThemeContext } from './ThemeContext'
interface Props extends TextInputProps {
    classRef?: React.LegacyRef<TextInput>
}

export default ({
    returnKeyType = 'none',
    autoCompleteType = 'off',
    autoCapitalize = 'none',
    autoCorrect = false,
    spellCheck = false,
    underlineColorAndroid = 'transparent',
    selectionColor = 'none',
    style,
    classRef,
    keyboardAppearance,
    ...restProps
}: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    const appearance = (activeTheme !== 'Dark') ? 'light' : 'dark'

    return (
        <TextInput
            enablesReturnKeyAutomatically={true}
            returnKeyType={returnKeyType}            
            autoCompleteType={autoCompleteType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            underlineColorAndroid={underlineColorAndroid}
            keyboardAppearance={appearance}
            ref={classRef}
            style={[localStyles.input, getThemedComponentStyle('TextInput')[activeTheme], style]}
            placeholderTextColor={getThemedComponentStyle('TextInput')[activeTheme]?.color}
            onSubmitEditing={Keyboard.dismiss}
            {...restProps}
        />
    )
}

const localStyles = StyleSheet.create({
    input: {
        paddingHorizontal: 10
    }
})

