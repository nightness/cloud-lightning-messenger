import 'react-native-gesture-handler'
import React, { useState, useContext, useEffect } from 'react'
import { ModalPortal } from 'react-native-modals'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { AppLoading } from 'expo'
import * as Notifications from 'expo-notifications';
import * as Fonts from 'expo-font'
import Playground from './components/Playground'
import Authentication from './components/Authentication'
import { ActivityIndicator, DisplayError } from './components/common/Components'
import { useAuthState } from './components/firebase/Firebase'
import { GlobalContext, GlobalProvider } from './components/shared/GlobalContext'
import { ProfileContext, ProfileProvider } from './components/shared/ProfileContext'
import { Defaults } from './components/shared/Constants'
import Home from './components/Home'
import Messenger from './components/messenger/Messenger'

const getFonts = () => Fonts.loadAsync({
    'serif-pro-black': require('./assets/fonts/SourceSerifPro/SourceSerifPro-Black.ttf'),
    'serif-pro-bold': require('./assets/fonts/SourceSerifPro/SourceSerifPro-Bold.ttf')
})

const Drawer = createDrawerNavigator()

const DrawerNavigator = () => {
    return (
        <ProfileProvider>
            <Drawer.Navigator
            //drawerContent={props => <DrawerContent {...props} />}
            >
                <Drawer.Screen
                    name="Home"
                    component={Home}
                    options={{ title: 'My Home Screen' }}
                />
                <Drawer.Screen
                    name="Messenger"
                    component={Messenger}
                    options={{ title: 'Messenger' }}
                />
            </Drawer.Navigator>
        </ProfileProvider>
    )
}

const Stack = createStackNavigator()
const AppStack = () => {
    const [user, firebaseLoading, firebaseError] = useAuthState()
    const { theme, setTheme } = useContext(GlobalContext)


    if (firebaseLoading) {
        return (
            <ActivityIndicator />
        )
    }
    else if (firebaseError) {
        return (
            <DisplayError errorMessage={"Firebase Error: " + firebaseError.message} />
        )
    }
    else {
        return (
            <NavigationContainer
                theme={theme === "Dark" ? DarkTheme : DefaultTheme}
            >
                <Stack.Navigator
                    headerMode="none"
                    initialRouteName={user ? "Main" : "Authentication"}
                    navigationOptions={({ navigation }) => ({
                        headerLeft: null
                    })}>
                    <Stack.Screen name="Authentication" component={Authentication} />
                    <Stack.Screen name="Main" component={DrawerNavigator} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

// ToDo: Register for Notifications
const register = async () => {
    //const { status } = await Notifications.
    //console.log(status)
}

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false)

    useEffect(() => {
        //register()
    }, [])

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
                { (Defaults.playgroundMode ? <Playground /> : <AppStack />)}
                <ModalPortal />
            </GlobalProvider>
        )
    }
}
