import React, { useContext } from 'react'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import { ScrollView, StyleProp, ViewStyle } from 'react-native'

interface Props {
    children: JSX.Element | JSX.Element[]
    style?: StyleProp<ViewStyle>
    bounces?: boolean
    keyboardShouldPersistTaps?: boolean | "always" | "never" | "handled"

}

export default ({ children, style, bounces, keyboardShouldPersistTaps, ...restProps }: Props) => {
    const { theme } = useContext(GlobalContext)

    return (
        <ScrollView
            style={[Styles.views.scrollView, Themes.screen[theme], style]}
            bounces={bounces}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            {...restProps}
        >
            {children}
        </ScrollView>
    )
}
