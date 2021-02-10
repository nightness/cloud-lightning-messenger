import React, { useContext, useRef } from 'react'
import { View, SafeAreaView } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'

export default ({ children, style, isSafe }) => {
    const { theme, setTheme } = useContext(GlobalContext)

    if (isSafe)
        return (
            <SafeAreaView style={[Styles.container.container, Themes.container[theme], style]} >
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
