import 'react-native-gesture-handler'
import React, { useContext } from 'react'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { ActivityIndicator, DisplayError } from './themed/Components'
import { useAuthState } from './firebase/Firebase'
import { GlobalContext } from './shared/GlobalContext'
import { ProfileProvider } from './shared/ProfileContext'
import Home from './Home'
import Messenger from './messenger/Messenger'
import DispatchMessenger from './messenger/DispatchMessenger'
import ManageGroups from './messenger/ManageGroups'
import ManageUserRoles from './messenger/ManageUserRoles'
import Authentication from './Authentication'
import { Playground } from './Playground'

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
                />
                <Drawer.Screen
                    name="Messenger"
                    component={Messenger}
                />
                <Drawer.Screen
                    name="Dispatch Messenger"
                    component={DispatchMessenger}
                />
                <Drawer.Screen
                    name="Manage Groups"
                    component={ManageGroups}
                />
                <Drawer.Screen
                    name="Manage User Roles"
                    component={ManageUserRoles}
                />
                <Drawer.Screen
                    name="Playground"
                    component={Playground}
                />
            </Drawer.Navigator>
        </ProfileProvider>
    )
}

const Stack = createStackNavigator()
export default () => {
    const [user, firebaseLoading, firebaseError] = useAuthState()
    const { theme } = useContext(GlobalContext)

    var render = <ActivityIndicator />
    if (firebaseError)
        render = <DisplayError errorMessage={"Firebase Error: " + firebaseError.message} />
    else if (!firebaseLoading)
        render = (
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
    return render
}

