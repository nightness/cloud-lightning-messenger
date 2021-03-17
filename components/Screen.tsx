import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../shared/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import ScreenHeader from './ScreenHeader'
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions, StyleProp, ViewStyle } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useKeyboard } from '../shared/Hooks'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientColors } from '../shared/GradientColors'


interface Props {
    children: JSX.Element
    style?: object
    navigation?: any
    title: string
}

export default ({ children, style, navigation, title }: Props) => {
    const { width, height } = Dimensions.get('window')
    const { theme, hamburgerBadgeText, screenOrientation, isKeyboardOpen } = useContext(GlobalContext)
    const { currentUser } = useContext(FirebaseContext)
    const [keyboardHeight] = useKeyboard()
    const [screenStyle, setScreenStyle] = useState<StyleProp<ViewStyle>>({
        height, width, position: 'absolute'
    })

    useEffect(() => {
        if (isKeyboardOpen) {
            setScreenStyle({
                height: height - keyboardHeight, width, position: 'absolute'
            })
        } else {
            setScreenStyle({
                height, width, position: 'absolute'
            })
        }
    }, [isKeyboardOpen, keyboardHeight, screenOrientation])

    return (
        <KeyboardAwareScrollView bounces={false} style={screenStyle}>
            <LinearGradient
                colors={GradientColors[theme].background}
                style={screenStyle}
            >
                <SafeAreaView style={screenStyle}>
                    <ScreenHeader
                        navigation={navigation}
                        title={title}
                        photoURL={currentUser && currentUser.photoURL}
                        hamburgerBadgeText={hamburgerBadgeText}
                    />
                    {children}
                </SafeAreaView>
            </LinearGradient>
        </KeyboardAwareScrollView>
    )
}
