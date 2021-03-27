import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types'
import { DrawerNavigationState, ParamListBase } from '@react-navigation/native'
import React, { ComponentType, createContext, useContext, useEffect, useState, useReducer } from 'react'
import { useDocumentData } from '../firebase/Firebase'
import { FirebaseContext } from '../firebase/FirebaseContext'
import Home from '../screens/Home'
import PrivateMessenger from '../messenger/PrivateMessenger'
import WallMessenger from '../messenger/WallMessenger'
import GroupMessenger from '../messenger/GroupMessenger'
import ManageGroups from '../messenger/ManageGroups'
import ManageUserRoles from '../messenger/ManageUserRoles'
import MyWall from '../messenger/MyWall'
import { Playground } from '../screens/Playground'
import {
    homeParams,
    messagesParams,
    myWallParams,
    memberWallParams,
    groupChatParams,
    manageGroupsParams,
    manageUserRolesParams,
    playgroundParams,
    NavigationParams
} from './DrawerParams'

type Notifications = {
    groups: { [routeName: string] : {} }
}
type Badges = { [routeName: string] : {} }

type ContextType = {
    badges: Badges
    setBadge: (routeName: string, value: string) => void
    screens: Screens
    screensManager?: (action: ReducerActions, index: number, screen: JSX.Element) => boolean
    navigation?: DrawerNavigationHelpers
    state?: DrawerNavigationState<ParamListBase>
    index?: number
    setDrawerContent: (navigation: DrawerNavigationHelpers, state: DrawerNavigationState<ParamListBase>) => void
}

type ScreenConfig = {
    name: string
    component: ComponentType<any>,
    initialParams: NavigationParams,
    claims?: string[]
}

type Screens = ScreenConfig[]

const rootScreens: Screens = [
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

export const DrawerContext = createContext<ContextType>({
    badges: {},
    screens: rootScreens,
    setBadge: (routeName: string, value: string) => undefined,
    setDrawerContent: (navigation: DrawerNavigationHelpers, state: DrawerNavigationState<ParamListBase>) => undefined
})

interface Props {
    children: JSX.Element | JSX.Element[]
}

type ReducerActions = 'insert' | 'remove'

type ReducerAction = {
    type: ReducerActions
    index: number
    screen: JSX.Element
}

const screensReducer = (currentState: Screens, action: ReducerAction) => {
    switch (action.type) {
        case 'insert': {

            return currentState
        }
        case 'remove': {

            return currentState
        }
    }
    return currentState
}

export const DrawerProvider = ({ children }: Props) => {
    const { currentUser } = useContext(FirebaseContext)
    const [document, loadingDocument, errorDocument] = useDocumentData(`notifications/${currentUser?.uid}`)
    const [badges, setBadges] = useState<Badges>({})
    const [navigation, setNavigation] = useState<DrawerNavigationHelpers>()
    const [state, setState] = useState<DrawerNavigationState<ParamListBase>>()
    const [index, setIndex] = useState<number>()
    //const [screens, setScreens] = useState<Screens>(rootScreens)
    const [screens, screensDispatch] = useReducer(screensReducer, rootScreens)

    const setBadge = (routeName: string, value: string): void => {
        let newState = {...badges}
        newState[routeName] = value
        setBadges(newState)
    }

    const setDrawerContent = (navigation: DrawerNavigationHelpers, state: DrawerNavigationState<ParamListBase>) => {
        setNavigation(navigation)
        setIndex(state.index)
        setState(state)
    }

    const screensManager = (action: ReducerActions, index: number, screen: JSX.Element) => {
        return true
    }

    // Used for watching for route index changes
    useEffect(() => {
        if (state && state.index != index)
            setIndex(state.index)
    }, [state?.index])

    useEffect(() => {
        // Guards
        if (loadingDocument || errorDocument || !document || !currentUser) return
        console.log((document as Notifications).groups)
        // Update the state of badges
        // setBadges(document as Badges)
    }, [document])

    return (
        <DrawerContext.Provider
            value={{
                badges,
                setBadge,
                navigation,
                state,
                index,
                screens,
                screensManager,
                setDrawerContent
            }}
        >
            {children}
        </DrawerContext.Provider>
    )
}