import React, { useContext } from 'react'
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
    children?: JSX.Element[]
    style?: StyleProp<any>
    classRef?: any
    value?: string
    placeholder?: string
    keyboardAppearance?: Theme
    defaultValue?: string
    onChangeText?: (text: string) => void
    onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
}

export default ({
    children,
    style,
    classRef,
    value,
    keyboardAppearance,
    placeholder,
    defaultValue,
    onChangeText,
    onKeyPress,
    onBlur,
    ...restProps
}: Props) => {
    const { theme } = useContext(GlobalContext)
    const appearance = keyboardAppearance !== 'Dark' ? 'light' : 'dark'

    return (
        // Anything before restProps are defaults, can be overwritten by restProps
        <TextInput
            autoCompleteType={'off'}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            {...restProps}
            keyboardAppearance={appearance}
            placeholder={placeholder}
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            defaultValue={defaultValue}
            value={value}
            ref={classRef}
            style={[Styles.textInput.input, Themes.textInput[theme], style]}
            placeholderTextColor={Themes.placeHolderText[theme].color}
        >
            {children}
        </TextInput>
    )
}
