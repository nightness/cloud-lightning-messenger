import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../app/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import ScreenHeader from './ScreenHeader'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleProp, ViewStyle, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientColors } from '../app/GradientColors'

interface Props {
    children: JSX.Element | JSX.Element[]
    style?: object
    navigation?: any
    title: string
}

export default ({ children, style, navigation, title }: Props) => {

    const { theme, hamburgerBadgeText, screenOrientation, isKeyboardOpen, keyboardHeight} = useContext(GlobalContext)
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
        <View style={screenStyle}>
            <LinearGradient
                colors={GradientColors[theme].background}
                style={screenStyle}
            >
                <SafeAreaView style={[screenStyle, style]}>
                    <ScreenHeader
                        navigation={navigation}
                        title={title}
                        photoURL={currentUser && currentUser.photoURL}
                        hamburgerBadgeText={hamburgerBadgeText}
                    />
                    {children}
                </SafeAreaView>
            </LinearGradient>
        </View>
    )
}
