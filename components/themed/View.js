import React, { useContext } from 'react'
import { View } from 'react-native'
import { Themes, Styles } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'

export default ({ children, style, ...restProps }) => {
    const { theme } = useContext(GlobalContext)

    return (
        <View style={[Styles.view.default, Themes.view[theme], style]} {...restProps}>
            {children}
        </View>
    )
}
