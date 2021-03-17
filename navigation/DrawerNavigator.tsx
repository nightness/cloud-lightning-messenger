import 'react-native-gesture-handler'
import React, { useContext, useEffect, useState } from 'react'
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
import { GlobalContext } from '../shared/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import {
    homeParams,
    messagesParams,
    myWallParams,
    memberWallParams,
    groupChatParams,
    manageGroupsParams,
    manageUserRolesParams,
    playgroundParams
} from './DrawerParams'

const Drawer = createDrawerNavigator()

export default () => {
    const { claims } = useContext(FirebaseContext)
    const { theme, isKeyboardOpen, screenOrientation } = useContext(GlobalContext)
    const globals = { theme: (theme as 'Light' | 'Dark') , isKeyboardOpen, screenOrientation }
    return (
        <ProfileProvider>
            <Drawer.Navigator
                drawerContent={DrawerContent}
            >
                <Drawer.Screen name="Home" component={Home} initialParams={{ ...globals,  ...homeParams}} />
                <Drawer.Screen name="My Wall" component={MyWall} initialParams={{ ...globals, ...myWallParams}} />
                <Drawer.Screen name="Member Walls" component={WallMessenger} initialParams={{ ...globals, ...memberWallParams}} />
                <Drawer.Screen name="Messages" component={PrivateMessenger} initialParams={{ ...globals, ...messagesParams}} />
                <Drawer.Screen name="Group Chat" component={GroupMessenger} initialParams={{ ...globals, ...groupChatParams}} />
                {claims?.admin ?
                    <>
                        <Drawer.Screen name="Manage Groups" component={ManageGroups} initialParams={{ ...globals, ...manageGroupsParams}} />
                        <Drawer.Screen name="Manage User Roles" component={ManageUserRoles} initialParams={{ ...globals, ...manageUserRolesParams}} />
                        <Drawer.Screen name="Playground" component={Playground} initialParams={{ ...globals, ...playgroundParams}} />
                    </> : <></>
                }
            </Drawer.Navigator>
        </ProfileProvider>
    )
}
