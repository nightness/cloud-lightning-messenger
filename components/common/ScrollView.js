import React, { useContext } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'

export default ({ children, style, navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)

    return (
        <KeyboardAwareScrollView style={[Styles.views.scrollView, Themes.screen[theme], style]}>
            {children}
        </KeyboardAwareScrollView>
    )
}