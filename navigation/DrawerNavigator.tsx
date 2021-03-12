import 'react-native-gesture-handler'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { ProfileContext, ProfileContextType, ProfileProvider } from '../shared/ProfileContext'
import Home from '../screens/Home'
import PrivateMessenger from '../messenger/PrivateMessenger'
import WallMessenger from '../messenger/WallMessenger'
import GroupMessenger from '../messenger/GroupMessenger'
import ManageGroups from '../messenger/ManageGroups'
import ManageUserRoles from '../messenger/ManageUserRoles'
import MyWall from '../messenger/MyWall'
import { Playground } from '../screens/Playground'
import { DrawerContent } from './DrawerContent'

const Drawer = createDrawerNavigator()

export default () => {
    return (
        <ProfileProvider>
            <Drawer.Navigator
            drawerContent={DrawerContent}
            >
                <Drawer.Screen name="Home" component={Home} />
                <Drawer.Screen name="Messages" component={PrivateMessenger} />
                <Drawer.Screen name="My Wall" component={MyWall} />
                <Drawer.Screen name="Member Walls" component={WallMessenger} />
                <Drawer.Screen name="Group Chat" component={GroupMessenger} />


                {/* Hide if not admin!
                <Drawer.Screen name="Manage Groups" component={ManageGroups} />
                <Drawer.Screen name="Manage User Roles" component={ManageUserRoles} />
                <Drawer.Screen name="Playground" component={Playground} /> */}
            </Drawer.Navigator>
        </ProfileProvider>
    )
}
