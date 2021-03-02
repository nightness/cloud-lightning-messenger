import 'react-native-gesture-handler'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { ProfileProvider } from '../shared/ProfileContext'
import Home from '../screens/Home'
import Messenger from '../messenger/Messenger'
import GroupMessenger from '../messenger/GroupMessenger'
import ManageGroups from '../messenger/ManageGroups'
//import ManageUserRoles from '../messenger/ManageUserRoles'
import MemberWall from '../messenger/MemberWall'
import { Playground } from '../screens/Playground'

const Drawer = createDrawerNavigator()

export default () => {
    return (
        <ProfileProvider>
            <Drawer.Navigator
            //drawerContent={props => <DrawerContent {...props} />}
            >
                <Drawer.Screen name="Home" component={Home} />
                <Drawer.Screen name="Wall" component={MemberWall} />
                <Drawer.Screen name="Messenger" component={Messenger} />
                <Drawer.Screen name="Group Messenger" component={GroupMessenger} />
                <Drawer.Screen name="Manage Groups" component={ManageGroups} />
                {/* <Drawer.Screen name="Manage User Roles" component={ManageUserRoles} /> */}
                <Drawer.Screen name="Playground" component={Playground} />
            </Drawer.Navigator>
        </ProfileProvider>
    )
}
