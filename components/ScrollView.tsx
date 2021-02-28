import React, { useContext } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import { StyleProp, ViewStyle } from 'react-native'

interface Props {
    children: JSX.Element[]
    style?: StyleProp<ViewStyle>
}

export default ({ children, style, ...restProps }: Props) => {
    const { theme } = useContext(GlobalContext)

    return (
        <KeyboardAwareScrollView
            style={[Styles.views.scrollView, Themes.screen[theme], style]}
            {...restProps}
        >
            {children}
        </KeyboardAwareScrollView>
    )
}
