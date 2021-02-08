import React, { useContext } from 'react'
import { View } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../constants/Constants'
import ScreenHeader from './ScreenHeader'

export default ({ children, style, navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)

    return (
        <View style={[Styles.views.screen, Themes.screen[theme], style]}>
            <ScreenHeader navigation={navigation} {...restProps} />
            {children}
        </View>
    )
}
