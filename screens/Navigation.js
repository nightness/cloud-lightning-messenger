import 'react-native-gesture-handler'
import React, { useContext } from 'react'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { ActivityIndicator, DisplayError } from '../components/Components'
import { useAuthState } from '../firebase/Firebase'
import { GlobalContext } from '../shared/GlobalContext'
import { ProfileProvider } from '../shared/ProfileContext'
import Home from './Home'
import Messenger from '../messenger/Messenger'
import GroupMessenger from '../messenger/GroupMessenger'
import ManageGroups from '../messenger/ManageGroups'
import ManageUserRoles from '../messenger/ManageUserRoles'
import MemberWall from '../messenger/MemberWall'
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
                    name="Wall"
                    component={MemberWall}
                />
                <Drawer.Screen
                    name="Messenger"
                    component={Messenger}
                />
                <Drawer.Screen
                    name="Group Messenger"
                    component={GroupMessenger}
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

    if (firebaseLoading)
        return (
            <ActivityIndicator />
        )
    if (firebaseError)
        return (
            <DisplayError errorMessage={"Firebase Error: " + firebaseError.message} />
        )
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

