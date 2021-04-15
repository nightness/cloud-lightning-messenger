import React, { useContext, useRef } from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'
import { GlobalContext } from '../app/GlobalContext'
import { Styles } from '../app/Styles'
import { Theme, Themes } from '../app/Themes'
interface Props {
    children: JSX.Element | JSX.Element[]
    style?: StyleProp<ViewStyle>
}

export default ({ children, style }: Props) => {
    const { theme } = useContext(GlobalContext)

    // Default Container
    return (
        <View style={[Styles.container.container, Themes.container[theme], style]}>
            {children}
        </View>
    )
}
