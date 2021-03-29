import Home from '../screens/Home'
import PrivateMessenger from '../messenger/PrivateMessenger'
import WallMessenger from '../messenger/WallMessenger'
import GroupMessenger from '../messenger/GroupMessenger'
import ManageGroups from '../messenger/ManageGroups'
import ManageUserRoles from '../messenger/ManageUserRoles'
import MyWall from '../messenger/MyWall'
import { Playground } from '../screens/Playground'
import { Screens } from './NavigationTypes'
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

export const initialScreens: Screens = [
    {
        name: "Home",
        component: Home,
        initialParams: homeParams
    },
    {
        name: "My Wall",
        component: MyWall,
        initialParams: myWallParams
    },
    {
        name: "Member Walls",
        component: WallMessenger,
        initialParams: memberWallParams
    },
    {
        name: "Messages",
        component: PrivateMessenger,
        initialParams: messagesParams
    },
    {
        name: "Group Chat",
        component: GroupMessenger,
        initialParams: groupChatParams
    },
    {
        name: "Manage Groups",
        component: ManageGroups,
        initialParams: manageGroupsParams,
        claims: [ 'admin' ]
    },
    {
        name: "Manage User Roles",
        component: ManageUserRoles,
        initialParams: manageUserRolesParams,
        claims: [ 'admin' ]
    },
    {
        name: "Playground",
        component: Playground,
        initialParams: playgroundParams,
        claims: [ 'admin' ]
    }
]
