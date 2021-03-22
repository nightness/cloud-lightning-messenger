import 'react-native-gesture-handler'
import React, { useContext, useEffect, useState } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { ProfileContext, ProfileContextType, ProfileProvider } from '../app/ProfileContext'
import Home from '../screens/Home'
import PrivateMessenger from '../messenger/PrivateMessenger'
import WallMessenger from '../messenger/WallMessenger'
import GroupMessenger from '../messenger/GroupMessenger'
import ManageGroups from '../messenger/ManageGroups'
import ManageUserRoles from '../messenger/ManageUserRoles'
import MyWall from '../messenger/MyWall'
import { Playground } from '../screens/Playground'
import { DrawerContent } from './DrawerContent'
import { GlobalContext } from '../app/GlobalContext'
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

    return (
        <ProfileProvider>
            <Drawer.Navigator
                drawerContent={props => <DrawerContent {...props} />}
                drawerStyle={{
                    //width: '200' --- Find and remove padding to the right of the badges
                }}
            >
                <Drawer.Screen name="Home" component={Home} initialParams={homeParams} />
                <Drawer.Screen name="My Wall" component={MyWall} initialParams={myWallParams} />
                <Drawer.Screen name="Member Walls" component={WallMessenger} initialParams={memberWallParams} />
                <Drawer.Screen name="Messages" component={PrivateMessenger} initialParams={messagesParams} />
                <Drawer.Screen name="Group Chat" component={GroupMessenger} initialParams={groupChatParams} />
                {claims?.admin ?
                    <>
                        <Drawer.Screen name="Manage Groups" component={ManageGroups} initialParams={manageGroupsParams} />
                        <Drawer.Screen name="Manage User Roles" component={ManageUserRoles} initialParams={manageUserRolesParams} />
                        <Drawer.Screen name="Playground" component={Playground} initialParams={playgroundParams} />
                    </> : <></>
                }
            </Drawer.Navigator>
        </ProfileProvider>
    )
}
