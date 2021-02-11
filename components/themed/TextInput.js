import React, { useContext, useRef, useEffect, Component, PureComponent } from 'react'
import { TextInput } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'

export default ({ children, style, classRef, ...restProps }) => {
    const { theme } = useContext(GlobalContext)

    return (
        // Anything before restProps are defaults, can be overwritten by restProps
        <TextInput
            autoCompleteType={'off'}
            autoComplete={false}
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
