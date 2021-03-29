import { DrawerNavigationState, NavigationHelpers, ParamListBase } from '@react-navigation/native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDocumentData } from '../firebase/Firebase'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { Badges, Screens, ScreenConfig, Notifications } from './NavigationTypes'
import { ReducerActionType } from './RouteReducer'
import { initialScreens } from './DefaultRoutes'

type ContextType = {
    badges: Badges
    setBadge: (routeName: string, value: string) => void
    screens: Screens
    screensManager?: (action: ReducerActionType, index: number, screen?: ScreenConfig) => boolean
    navigation?: NavigationHelpers<any>
    state?: DrawerNavigationState<ParamListBase>
    screenIndex?: number
    setDrawerContent: (navigation: NavigationHelpers<any>, state: DrawerNavigationState<ParamListBase>) => void
}

export const DrawerContext = createContext<ContextType>({
    badges: {},
    screens: initialScreens,
    setBadge: (routeName: string, value: string) => undefined,
    setDrawerContent: (navigation: NavigationHelpers<any>, state: DrawerNavigationState<ParamListBase>) => undefined
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
    const [navigation, setNavigation] = useState<NavigationHelpers<any>>()
    const [state, setState] = useState<DrawerNavigationState<ParamListBase>>()
    const [screenIndex, setScreenIndex] = useState<number>()

    const setBadge = (routeName: string, value: string): void => {
        let newState = {...badges}
        newState[routeName] = value
        setBadges(newState)
    }

    const setDrawerContent = (currentNavigation: NavigationHelpers<any>, state: DrawerNavigationState<ParamListBase>) => {
        if (currentNavigation != navigation)
            setNavigation(currentNavigation)
        setScreenIndex(state.index)
        setState(state)
    }

    const screensManager = (action: ReducerActionType, index: number, screen?: ScreenConfig) => {
        // If removing the current screen, go back in the history first, then remove
        if (action === 'remove' && index === screenIndex)
            navigation?.goBack()
        screensDispatch({
            type: action,
            index,
            screen
        })        
        return true
    }

    // Used for watching for route index changes
    useEffect(() => {
        if (state && state.index != screenIndex)
            setScreenIndex(state.index)
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
                screenIndex,
                screens,
                screensManager,
                setDrawerContent
            }}
        >
            {children}
        </DrawerContext.Provider>
    )
}