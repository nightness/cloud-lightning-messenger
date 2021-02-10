import 'react-native-gesture-handler'
import React, { useState } from 'react'
import { ModalPortal } from 'react-native-modals'
import { AppLoading } from 'expo'
import * as Fonts from 'expo-font'
import { FirebaseProvider } from './components/firebase/FirebaseContext'
import { GlobalProvider } from './components/shared/GlobalContext'
import { Defaults } from './components/shared/Constants'
import Playground from './components/Playground'
import AppNavigator from './components/Navigation'

const getFonts = () => Fonts.loadAsync({
    'serif-pro-black': require('./assets/fonts/SourceSerifPro/SourceSerifPro-Black.ttf'),
    'serif-pro-bold': require('./assets/fonts/SourceSerifPro/SourceSerifPro-Bold.ttf')
})

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false)

    if (!fontsLoaded) {
        return (
            <AppLoading
                startAsync={getFonts}
                onFinish={() => setFontsLoaded(true)}
            />
        )
    }
    else {
        return (
            <GlobalProvider>
                <FirebaseProvider>
                    {(Defaults.playgroundMode ? <Playground /> : <AppNavigator />)}
                    <ModalPortal />
                </FirebaseProvider>
            </GlobalProvider>
        )
    }
}
