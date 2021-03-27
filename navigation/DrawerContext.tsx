import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types'
import { DrawerNavigationState, ParamListBase } from '@react-navigation/native'
import React, { ComponentType, createContext, useContext, useEffect, useState, useReducer, ReducerAction } from 'react'
import { useDocumentData } from '../firebase/Firebase'
import { FirebaseContext } from '../firebase/FirebaseContext'
//import { NavigationParams } from './DrawerParams'
import { rootScreens } from './DefaultRoutes'
import { Badges, Screens, ScreenConfig, Notifications } from './NavigationTypes'
import { ReducerActionType } from './RouteReducer'

type ContextType = {
    badges: Badges
    setBadge: (routeName: string, value: string) => void
    screens: Screens
    screensManager?: (action: ReducerActionType, index: number, screen?: ScreenConfig) => boolean
    navigation?: DrawerNavigationHelpers
    state?: DrawerNavigationState<ParamListBase>
    index?: number
    setDrawerContent: (navigation: DrawerNavigationHelpers, state: DrawerNavigationState<ParamListBase>) => void
}

export const DrawerContext = createContext<ContextType>({
    badges: {},
    screens: rootScreens,
    setBadge: (routeName: string, value: string) => undefined,
    setDrawerContent: (navigation: DrawerNavigationHelpers, state: DrawerNavigationState<ParamListBase>) => undefined
})

interface Props {
    children: JSX.Element | JSX.Element[]
    screens: Screens
    screensDispatch: React.Dispatch<any>
}

export const DrawerProvider = ({ children, screens, screensDispatch }: Props) => {
    const { currentUser } = useContext(FirebaseContext)
    const [document, loadingDocument, errorDocument] = useDocumentData(`notifications/${currentUser?.uid}`)
    const [badges, setBadges] = useState<Badges>({})
    const [navigation, setNavigation] = useState<DrawerNavigationHelpers>()
    const [state, setState] = useState<DrawerNavigationState<ParamListBase>>()
    const [index, setIndex] = useState<number>()

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

    const screensManager = (action: ReducerActionType, index: number, screen?: ScreenConfig) => {
        if (!screensDispatch) return false
        screensDispatch({
            type: action,
            index,
            screen
        })
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