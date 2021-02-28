import React, { useContext, useRef } from 'react'
import { View, SafeAreaView } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Theme, Themes } from '../shared/Themes'

interface Props {
    children: JSX.Element[]
    style?: any
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