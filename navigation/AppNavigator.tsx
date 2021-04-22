import 'react-native-gesture-handler'
import React, { useContext, useEffect } from 'react'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ActivityIndicator, DisplayError, ThemeContext } from 'cloud-lightning-themed-ui'
import { useAuthState } from '../firebase/Firebase'
import { DrawerNavigator } from 'react-navigation-dynamic-drawer'
import Authentication from '../screens/Authentication'
import { initialNavigationElements } from './DefaultRoutes'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { GradientColors } from '../app/GradientColors'

const Stack = createStackNavigator()
export default () => {
    const [user, firebaseLoading, firebaseError] = useAuthState()
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    const { claims } = useContext(FirebaseContext)
    const colorSet = GradientColors[activeTheme]

    if (firebaseLoading) return <ActivityIndicator />
    if (firebaseError) return <DisplayError error={firebaseError} />
    return (
        <NavigationContainer theme={activeTheme === 'Dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
                headerMode="none"
                initialRouteName={user ? 'Main' : 'Authentication'}
            >
                <Stack.Screen name="Authentication" component={Authentication} />
                <Stack.Screen name="Main">
                    {props => <DrawerNavigator
                        {...props}
                        background={colorSet.drawer}
                        claims={claims}
                        initialScreens={initialNavigationElements}
                        labelStyle={getThemedComponentStyle('Text')[activeTheme]}
                    />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
