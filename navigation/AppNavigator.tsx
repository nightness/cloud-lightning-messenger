import 'react-native-gesture-handler'
import React, { useContext } from 'react'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ActivityIndicator, DisplayError } from '../components/Components'
import { useAuthState } from '../firebase/Firebase'
import { GlobalContext } from '../shared/GlobalContext'
import DrawerNavigator from './DrawerNavigator'
import Authentication from '../screens/Authentication'

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
                <Stack.Screen name="Main" component={DrawerNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
