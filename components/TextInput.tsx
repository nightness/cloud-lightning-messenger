import React, { useContext, useRef, useEffect, Component, PureComponent } from 'react'
import { StyleProp, TextInput } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'

interface Props {
    children?: JSX.Element[]
    style?: StyleProp<any>
    classRef?: any
}

export default ({ children, style, classRef, ...restProps }: Props) => {
    const { theme } = useContext(GlobalContext)

    return (
        // Anything before restProps are defaults, can be overwritten by restProps
        <TextInput
            autoCompleteType={'off'}
            autoCapitalize="none"
            autoCorrect={false}
            underlineColorAndroid="transparent"
            {...restProps}
            ref={classRef}
            style={[Styles.textInput.input, Themes.textInput[theme], style]}
            placeholderTextColor={Themes.placeHolderText[theme].color}
        >
            {children}
        </TextInput>
    )
}
