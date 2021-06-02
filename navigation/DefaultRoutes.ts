import Empty from '../screens/Empty'
import Home from '../screens/Home'
import PrivateMessenger from '../messenger/PrivateMessenger'
import WallMessenger from '../messenger/WallMessenger'
import GroupMessenger from '../messenger/GroupMessenger'
import ManageGroups from '../messenger/ManageGroups'
import ManageUserRoles from '../messenger/ManageUserRoles'
import MyWall from '../messenger/MyWall'
import Room from '../webrtc/Room'
import { ToastExample } from '../screens/ToastExample'
import { Playground } from '../screens/Playground'
import { NavigationElements } from '../navigation'

import {
    homeParams,
    messagesParams,
    myWallParams,
    memberWallParams,
    groupChatParams,
    manageGroupsParams,
    manageUserRolesParams,
    playgroundParams,
} from './DrawerParams'

export const initialNavigationElements: NavigationElements = [
    {
        label: 'Home',
        routeName: 'Home',
        component: Home,
        initialParams: homeParams,
        depth: 0,
    },
    // {
    //     label: 'Walls',
    //     routeName: 'MyWall',
    //     component: MyWall,
    //     initialParams: myWallParams,
    //     depth: 0
    // },
    {
        label: 'Member Walls',
        routeName: 'MemberWalls',
        component: WallMessenger,
        initialParams: memberWallParams,
        depth: 0,
    },
    {
        label: 'Messages',
        routeName: 'Messages',
        component: PrivateMessenger,
        initialParams: messagesParams,
        depth: 0,
    },
    {
        label: 'Group Chat',
        routeName: 'GroupChat',
        component: GroupMessenger,
        initialParams: groupChatParams,
        depth: 0,
    },
    {
        label: 'Video Chat',
        routeName: 'VideoChat',
        component: Room,
        initialParams: groupChatParams,
        depth: 0,
    },
    {
        label: 'Admin Settings',
        routeName: 'AdminHome',
        component: Empty,
        initialParams: manageGroupsParams,
        depth: 0,
        claims: ['admin'],
    },
    {
        label: 'Manage Groups',
        routeName: 'ManageGroups',
        component: ManageGroups,
        initialParams: manageGroupsParams,
        depth: 1,
        claims: ['admin'],
    },
    {
        label: 'Manage User Roles',
        routeName: 'ManageUserRoles',
        component: ManageUserRoles,
        initialParams: manageUserRolesParams,
        depth: 1,
        claims: ['admin'],
    },
    {
        label: 'Playground',
        routeName: 'Playground',
        component: Playground,
        initialParams: playgroundParams,
        depth: 0,
        claims: ['admin'],
    },
    {
        label: 'Toast Example',
        routeName: 'Toast Example',
        component: ToastExample,
        initialParams: playgroundParams,
        depth: 0,
        claims: ['admin'],
    },
]
