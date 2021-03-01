import React, { useContext } from 'react'
import { View } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import ScreenHeader from './ScreenHeader'

interface Props {
    children: JSX.Element
    style?: object
    navigation?: any
    title: string
}

export default ({ children, style, navigation, title, ...restProps }: Props) => {
    const { theme } = useContext(GlobalContext)
    const { currentUser } = useContext(FirebaseContext)
    const themeName = theme.toString()

    return (
        <View style={[Styles.views.screen, Themes.screen[theme], style]}>
            <ScreenHeader
                navigation={navigation}
                title={title}
                photoURL={currentUser && currentUser.photoURL}
                {...restProps}
            />
            {children}
        </View>
    )
}
