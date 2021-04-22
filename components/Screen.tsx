import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../app/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import ScreenHeader from './ScreenHeader'
import { StyleProp, ViewStyle, View, useWindowDimensions } from 'react-native'
import { GradientColors } from '../app/GradientColors'
import { Container, ThemeContext } from 'cloud-lightning-themed-ui'

interface Props {
    children: JSX.Element | JSX.Element[]
    style?: object
    navigation?: any
    title: string
}

export default ({ children, style, navigation, title }: Props) => {

    const { hamburgerBadgeText } = useContext(GlobalContext)
    const { activeTheme, getThemedComponentStyle, screenOrientation, isKeyboardOpen, keyboardHeight } = useContext(ThemeContext)
    const { width, height } = useWindowDimensions()
    const { currentUser } = useContext(FirebaseContext)
    const [screenStyle, setScreenStyle] = useState<StyleProp<ViewStyle>>({
        height, width, position: 'absolute'
    })

    useEffect(() => {
        if (isKeyboardOpen && height) {
            setScreenStyle({
                height: height - keyboardHeight, width, position: 'absolute'
            })
        } else {
            setScreenStyle({
                height, width, position: 'absolute'
            })
        }
    }, [isKeyboardOpen, keyboardHeight, screenOrientation, width, height])

    return (
        <Container style={screenStyle} background={GradientColors[activeTheme].background}>
            <View style={[screenStyle, style]}>
                <ScreenHeader
                    navigation={navigation}
                    title={title}
                    photoURL={currentUser && currentUser.photoURL}
                    hamburgerBadgeText={hamburgerBadgeText}
                />
                {children}
            </View>
        </Container>
    )
}

