import React, { useContext, useRef, useEffect, Component, PureComponent } from 'react'
import {
    NativeSyntheticEvent,
    StyleProp,
    TextInput,
    TextInputKeyPressEventData,
} from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'

interface Props {
    children?: JSX.Element[]
    style?: StyleProp<any>
    classRef?: any
    value?: string
    onChangeText?: (text: string) => void
    onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void
}

export default ({
    children,
    style,
    classRef,
    value,
    onChangeText,
    onKeyPress,
    ...restProps
}: Props) => {
    const { theme } = useContext(GlobalContext)

    return (
        // Anything before restProps are defaults, can be overwritten by restProps
        <TextInput
            autoCompleteType={'off'}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            {...restProps}
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
            value={value}
            ref={classRef}
            style={[Styles.textInput.input, Themes.textInput[theme], style]}
            placeholderTextColor={Themes.placeHolderText[theme].color}
        >
            {children}
        </TextInput>
    )
}
