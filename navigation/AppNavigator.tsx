import 'react-native-gesture-handler'
import React, { useContext } from 'react'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ActivityIndicator, DisplayError } from '../components/Components'
import { useAuthState } from '../firebase/Firebase'
import { GlobalContext } from '../app/GlobalContext'
import { DrawerNavigator } from 'react-navigation-dynamic-drawer'
import Authentication from '../screens/Authentication'
import { useTheme } from '@react-navigation/native';
import { initialNavigationElements } from './DefaultRoutes'

const Stack = createStackNavigator()
export default () => {
    const [user, firebaseLoading, firebaseError] = useAuthState()
    const { theme } = useContext(GlobalContext)

    if (firebaseLoading) return <ActivityIndicator />
    if (firebaseError) return <DisplayError error={firebaseError} />
    return (
        <NavigationContainer theme={theme === 'Dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
                headerMode="none"
                initialRouteName={user ? 'Main' : 'Authentication'}
            >
                <Stack.Screen name="Authentication" component={Authentication} />
                <Stack.Screen name="Main">
                    {props => <DrawerNavigator {...props} initialScreens={initialNavigationElements}></DrawerNavigator>}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
