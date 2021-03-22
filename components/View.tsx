import React, { useContext } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { GlobalContext } from '../app/GlobalContext'
import { Styles } from '../app/Styles'
import { Themes } from '../app/Themes'

export interface ViewProps {
    children: JSX.Element | JSX.Element[]
    style?: StyleProp<ViewStyle>
}

export default ({ children, style, ...restProps }: ViewProps) => {
    const { theme } = useContext(GlobalContext)

    return (
        <View style={[Themes.view[theme], style]} {...restProps}>
            {children}
        </View>
    )
}
