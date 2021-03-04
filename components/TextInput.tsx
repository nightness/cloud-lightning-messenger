import React, { useState, useContext, useEffect } from 'react'
import {
    NativeSyntheticEvent,
    StyleProp,
    TextInput,
    TextInputFocusEventData,
    TextInputKeyPressEventData,
} from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Theme, Themes } from '../shared/Themes'

interface Props {
    secureTextEntry?: boolean
    autoCompleteType?: "off" | "cc-csc" | "cc-exp" | "cc-exp-month" | "cc-exp-year" | "cc-number" | "email" | "name" | "password" | "postal-code" | "street-address" | "tel" | "username"
    autoCapitalize?: "none" | "sentences" | "words" | "characters"
    autoCorrect?: boolean
    underlineColorAndroid?: string
    children?: JSX.Element[]
    style?: StyleProp<any>
    classRef?: any
    placeholder?: string
    saveHistory?: boolean
    keyboardAppearance?: Theme
    value?: string
    onSubmit?: (text: string) => void
    onChangeText?: (text: string) => void
    onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
}

export default ({
    secureTextEntry = false,
    autoCompleteType = 'off',
    autoCapitalize = 'none',
    autoCorrect = false,
    underlineColorAndroid = 'transparent',
    children,
    style,
    classRef,
    keyboardAppearance,
    saveHistory,
    placeholder,
    value,
    onSubmit,
    onChangeText,
    onKeyPress,
    onBlur
}: Props) => {
    const { theme } = useContext(GlobalContext)
    const [history, setHistory] = useState<Array<string>>([])
    const [historyIndex, setHistoryIndex] = useState<number>(-1)
    const [_value, setValue] = useState<string>(value ? value : '')
    const appearance = keyboardAppearance !== 'Dark' ? 'light' : 'dark'

    const onArrowUp = () => {
        if (historyIndex < history.length - 1)
            setHistoryIndex(historyIndex + 1)
    }

    const onArrowDown = () => {
        if (historyIndex >= 0)
            setHistoryIndex(historyIndex - 1)
    }

    const onEnterPressed = () => {
        setHistoryIndex(-1)
        setHistory([_value, ...history])
        onSubmit && onSubmit(_value)
        setValue('')
    }

    const _onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (saveHistory) {
            if (e.nativeEvent.key === 'ArrowUp')
                onArrowUp()
            else if (e.nativeEvent.key === 'ArrowDown')
                onArrowDown()
        }
        if (e.nativeEvent.key === 'Enter')
            onEnterPressed()
        // Call parent handler
        onKeyPress && onKeyPress(e)
    }

    const _onChangeText = (text: string) => {
        setValue(text)
        // Call parent handler
        onChangeText && onChangeText(text)
    }

    useEffect(() => {
        // If parent is clearing the value, it must of been submitted by a button
        if (value === '' && _value !== value) {
            setHistoryIndex(-1)
            setHistory([_value, ...history])
        }
        if (typeof value === 'string' && _value !== value)
            setValue(value)
    }, [value])

    useEffect(() => {
        if (historyIndex < 0) {
            setValue('')
            return
        }
        const text = history[historyIndex]
        setValue(text)
        onChangeText && onChangeText(text)
    }, [historyIndex])

    return (
        // Anything before restProps are defaults, can be overwritten by restProps
        <TextInput
            secureTextEntry={secureTextEntry}
            autoCompleteType={autoCompleteType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            underlineColorAndroid={underlineColorAndroid}
            keyboardAppearance={appearance}
            placeholder={placeholder}
            onChangeText={_onChangeText}
            onKeyPress={_onKeyPress}
            onBlur={onBlur}
            value={_value}
            ref={classRef}
            style={[Styles.textInput.input, Themes.textInput[theme], style]}
            placeholderTextColor={Themes.placeHolderText[theme].color}
        >
            {children}
        </TextInput>
    )
}
