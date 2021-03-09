import React, { useContext } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import { StyleProp, ViewStyle } from 'react-native'

interface Props {
    children: JSX.Element | JSX.Element[]
    style?: StyleProp<ViewStyle>
    bounces?: boolean
    keyboardShouldPersistTaps?: boolean | "always" | "never" | "handled"

}

export default ({ children, style, bounces, keyboardShouldPersistTaps, ...restProps }: Props) => {
    const { theme } = useContext(GlobalContext)

    return (
        <KeyboardAwareScrollView
            style={[Styles.views.scrollView, Themes.screen[theme], style]}
            bounces={bounces}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            {...restProps}
        >
            {children}
        </KeyboardAwareScrollView>
    )
}
