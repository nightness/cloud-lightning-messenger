import React, { useContext } from 'react'
import { View } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import ScreenHeader from './ScreenHeader'
import { LinearGradient } from 'expo-linear-gradient'

interface Props {
    children: JSX.Element
    style?: object
    navigation?: any
    title: string
}

export default ({ children, style, navigation, title }: Props) => {
    const { theme, hamburgerBadgeText } = useContext(GlobalContext)
    const { currentUser } = useContext(FirebaseContext)

    return (
        <LinearGradient
            colors={['#ada9f0', '#88ddd2', '#8ccfdd']}
            style={{
                flex: 1,
            }}
        >
            <ScreenHeader
                navigation={navigation}
                title={title}
                photoURL={currentUser && currentUser.photoURL}
                hamburgerBadgeText={hamburgerBadgeText}
            />
            {children}
        </LinearGradient>
    )
}
