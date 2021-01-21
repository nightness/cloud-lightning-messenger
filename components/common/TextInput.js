import React, { useContext, useRef, useEffect, Component, PureComponent } from 'react'
import { TextInput } from 'react-native'
//import { TextInput } from 'react-native-paper';
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'

export default ({ children, style, classRef, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)

    return (
        <TextInput
            {...restProps}
            ref={classRef}
            style={[Styles.textInput.input, Themes.textInput[theme], style]}
            placeholderTextColor={Themes.textInputPlaceHolder[theme].color}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
        >
            {children}
        </TextInput>
    )
}
