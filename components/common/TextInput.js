import React, { useContext, useRef, useEffect, Component, PureComponent } from 'react'
import { TextInput } from 'react-native'
//import { TextInput } from 'react-native-paper';
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'

export default ({ children, style, classRef, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)

    return (
        // The auto's are just defaults, they can be overwritten by restProps
        <TextInput
            autoCompleteType={'off'}
            autoComplete={false}
            autoCapitalize="none"
            autoCorrect={false}
            {...restProps}
            ref={classRef}
            style={[Styles.textInput.input, Themes.textInput[theme], style]}
            placeholderTextColor={Themes.textInputPlaceHolder[theme].color}
            underlineColorAndroid="transparent"
        >
            {children}
        </TextInput>
    )
}
