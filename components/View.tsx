import React, { useContext } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'

export interface ViewProps {
    children: JSX.Element | JSX.Element[]
    style?: StyleProp<ViewStyle>
}

export default ({ children, style, ...restProps }: ViewProps) => {
    const { theme } = useContext(GlobalContext)

    return (
        <View style={[Styles.view.default, Themes.view[theme], style]} {...restProps}>
            {children}
        </View>
    )
}
