import React, { useContext } from 'react'
import { View } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { Themes, Styles } from '../shared/Constants'
import ScreenHeader from './ScreenHeader'

export default ({ children, style, navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const { currentUser } = useContext(FirebaseContext)

    return (
        <View style={[Styles.views.screen, Themes.screen[theme], style]}>
            <ScreenHeader navigation={navigation} photoURL={currentUser.photoURL} {...restProps} />
            {children}
        </View>
    )
}
