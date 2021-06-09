import 'react-native-gesture-handler'
import React, { useState } from 'react'
// @ts-ignore
import AppLoading from 'expo-app-loading'
import * as Fonts from 'expo-font'
import { FirebaseProvider } from './database/FirebaseContext'
import { GlobalProvider } from './app/GlobalContext'
import AppNavigator from './navigation/AppNavigator'
import { ThemeProvider } from './components/ThemeContext'
import { themes } from './app/Themes'
import { SafeAreaView } from 'react-native'

const getFonts = () =>
    Fonts.loadAsync({
        'serif-pro-black': require('./assets/fonts/SourceSerifPro/SourceSerifPro-Black.ttf'),
        'serif-pro-bold': require('./assets/fonts/SourceSerifPro/SourceSerifPro-Bold.ttf'),
    })

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false)

    if (!fontsLoaded) {
        return <AppLoading
            startAsync={getFonts}
            onFinish={() => setFontsLoaded(true)}
            onError={(error) => console.error(error)}
        />
    } else {
        return (
            <GlobalProvider>
                <ThemeProvider themes={themes}>
                    <FirebaseProvider>
                        <AppNavigator />
                    </FirebaseProvider>
                </ThemeProvider>
            </GlobalProvider>
        )
    }
}
