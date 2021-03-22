import React, { useContext, useRef } from 'react'
import { View, SafeAreaView, StyleProp, ViewStyle } from 'react-native'
import { GlobalContext } from '../app/GlobalContext'
import { Styles } from '../app/Styles'
import { Theme, Themes } from '../app/Themes'

interface Props {
    children: JSX.Element | JSX.Element[]
    style?: StyleProp<ViewStyle>
    isSafe?: boolean
}

export default ({ children, style, isSafe = false }: Props) => {
    const { theme } = useContext(GlobalContext)

    if (isSafe)
        return (
            <SafeAreaView
                style={[Styles.container.container, Themes.container[theme], style]}
            >
                {children}
            </SafeAreaView>
        )

    // Default Container
    return (
        <View style={[Styles.container.container, Themes.container[theme], style]}>
            {children}
        </View>
    )
}
