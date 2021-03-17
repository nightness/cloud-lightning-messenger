import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../shared/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import ScreenHeader from './ScreenHeader'
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions, Keyboard, StyleProp, ViewStyle } from 'react-native'
import KeyboardListener from 'react-native-keyboard-listener'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useKeyboard } from '../shared/Hooks'


interface Props {
    children: JSX.Element
    style?: object
    navigation?: any
    title: string
}

export default ({ children, style, navigation, title }: Props) => {
    const { width, height } = Dimensions.get('window')
    const { theme, hamburgerBadgeText, screenOrientation } = useContext(GlobalContext)
    const { currentUser } = useContext(FirebaseContext)
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false)
    const [keyboardHeight] = useKeyboard()
    const [screenStyle, setScreenStyle] = useState<StyleProp<ViewStyle>>({
        height, width, position: 'absolute'
    })

    useEffect(() => {
        console.log(screenOrientation)
        if (isKeyboardOpen) {
            console.log(keyboardHeight)
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
        <KeyboardAwareScrollView bounces={false}>
            <LinearGradient
                colors={['#ada9f0', '#88ddd2', '#8ccfdd']}
                style={screenStyle}
            >
                <KeyboardListener
                    onWillShow={() => setIsKeyboardOpen(true)}
                    onWillHide={() => setIsKeyboardOpen(false)}
                />

                <ScreenHeader
                    navigation={navigation}
                    title={title}
                    photoURL={currentUser && currentUser.photoURL}
                    hamburgerBadgeText={hamburgerBadgeText}
                />
                {children}
            </LinearGradient>
        </KeyboardAwareScrollView>
    )
}
