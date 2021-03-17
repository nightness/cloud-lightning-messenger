import React, { useState, useContext, useEffect } from 'react'
import { TextInputProps, Keyboard } from 'react-native'
import { TextInput } from 'react-native-paper'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Theme, Themes } from '../shared/Themes'
interface Props extends TextInputProps {
    label?: string
    classRef?: any
}

export default ({
    returnKeyType = 'none',
    autoCompleteType = 'off',
    autoCapitalize = 'none',
    autoCorrect = false,
    spellCheck = false,
    underlineColorAndroid = 'transparent',
    selectionColor = 'none',
    label,
    style,
    classRef,
    keyboardAppearance,
    ...restProps
}: Props) => {
    const { theme } = useContext(GlobalContext)
    const appearance = (theme !== 'Dark') ? 'light' : 'dark'

    return (
        <TextInput
            // mode='outlined'
            label={label}
            enablesReturnKeyAutomatically={true}
            returnKeyType={returnKeyType}            
            autoCompleteType={autoCompleteType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            underlineColorAndroid={underlineColorAndroid}
            keyboardAppearance={appearance}
            ref={classRef}
            style={[Styles.textInput.input, Themes.textInput[theme], style]}
            placeholderTextColor={Themes.placeHolderText[theme].color}
            onSubmitEditing={Keyboard.dismiss}
            {...restProps}
        />
    )
}
