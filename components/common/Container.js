import React, { useContext, useRef } from 'react'
import { View, SafeAreaView } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../constants/Constants'
import { ScrollView } from '../common/Components'

export default ({ children, style, isSafe, isScrollable, autoScrollToEnd }) => {
    const { theme, setTheme } = useContext(GlobalContext)
    const scrollView = useRef()

    if (isSafe && isScrollable)
        return (
            <SafeAreaView style={[Styles.container.container, Themes.container[theme], style]}>
                <ScrollView
                    style={Styles.container.scrollView}
                    ref={scrollView}
                    onContentSizeChange={() => scrollView.current.scrollToEnd({ animated: true })}
                >
                    {children}
                </ScrollView>
            </SafeAreaView>
        )
    if (isSafe)
        return (
            <SafeAreaView style={[Styles.container.container, Themes.container[theme], style]} >
                {children}
            </SafeAreaView>
        )
    if (!isSafe && isScrollable)
        return (
            <View style={[Styles.container.container, Themes.container[theme], style]}>
                <ScrollView
                    style={Styles.container.scrollView}
                    ref={scrollView}
                    onContentSizeChange={() => autoScrollToEnd ? scrollView.current.scrollToEnd({ animated: false }) : false}
                >
                    {children}
                </ScrollView>
            </View>
        )
    else
        return (
            <View style={[Styles.container.container, Themes.container[theme], style]}>
                {children}
            </View>
        )
}
