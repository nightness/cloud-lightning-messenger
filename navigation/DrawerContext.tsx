import { DrawerNavigationState, NavigationHelpers, ParamListBase } from '@react-navigation/native'
import React, { createContext, useState } from 'react'
import { Badges, NavigationElements, NavigationElement } from './NavigationTypes'
import { ScreenActions } from './RoutingReducer'

interface Props {
    children: JSX.Element | JSX.Element[],
    screens: NavigationElements,
    screensDispatch: React.Dispatch<any>
}

interface ScreenManagerProps {
    getIndex: (screenPath: [number]) => number | undefined,
    getScreenPath: (index: number) => [number] | undefined,
    addChild: (screenPath: [number], index: number, screenConfig: NavigationElement) => boolean,
    reducer: (type: ScreenActions, index: number, screen?: NavigationElement) => boolean
}

type ContextType = {
    badges: Badges,
    setBadge: (routeName: string, value: string) => void,
    screens: NavigationElements,
    ScreenManager?: ScreenManagerProps,
    hamburgerBadge?: string,
    setHamburgerBadge?: React.Dispatch<React.SetStateAction<string | undefined>>
    navigation?: NavigationHelpers<any>,
    state?: DrawerNavigationState<ParamListBase>,
    screenIndex?: number,
    setDrawerContent: (navigation: NavigationHelpers<any>, state: DrawerNavigationState<ParamListBase>) => void,
}

export const DrawerContext = createContext<ContextType>({
    badges: {},
    screens: [],
    setBadge: (routeName: string, value: string) => undefined,
    setDrawerContent: (navigation: NavigationHelpers<any>, state: DrawerNavigationState<ParamListBase>) => undefined
})

const equals = (a:[number], b:[number]) => a.length === b.length && a.every((v, i) => v === b[i])

export const DrawerProvider = ({ children, screens, screensDispatch }: Props) => {
    const [badges, setBadges] = useState<Badges>({})
    const [hamburgerBadge, setHamburgerBadge] = useState<string>()
    const [navigation, setNavigation] = useState<NavigationHelpers<any>>()
    const [state, setState] = useState<DrawerNavigationState<ParamListBase>>()
    const screenIndex = state ? state.index : -1

    const setBadge = (routeName: string, value: string): void => {
        let newState = { ...badges }
        newState[routeName] = value
        setBadges(newState)
    }

    const setDrawerContent = (currentNavigation: NavigationHelpers<any>, state: DrawerNavigationState<ParamListBase>) => {
        if (currentNavigation != navigation)
            setNavigation(currentNavigation)
        setState(state)
    }

    const ScreenManager: ScreenManagerProps = {
        reducer: (type: ScreenActions, index: number, screen?: NavigationElement) => {
            // If removing the current screen, go back in the history first, then remove
            if (type === 'remove' && index === screenIndex && navigation && navigation.canGoBack())
                navigation.goBack()
            screensDispatch({ type, index, screen })
            return true
        },
        addChild: (parentScreenPath: [number], index: number, screenConfig: NavigationElement) => {
            const parentIndex = ScreenManager.getIndex(parentScreenPath)
            if (!parentIndex) throw new Error(`addChild: Parent index not found`)
            return false
        },
        getIndex: (screenPath: [number]) => {
            let path: [number] = [0]
            let currentDepth = 0

            if (equals(screenPath, [0])) return 0
            for (let index = 1; index <= screens.length; index++) {
                // Check for a depth change
                const { depth } = screens[index]
                if (depth > currentDepth) {
                    currentDepth++
                    path.push(-1)
                }
                if (depth < currentDepth) {
                    currentDepth--
                    path.pop()
                }

                // Increment the path's index for this depth
                path[currentDepth]++

                if (equals(screenPath, path)) {
                    return index
                }
            }
            return -1
        },
        getScreenPath: (searchIndex: number) => {
            let path: [number] = [0]
            let currentDepth = 0

            for (let index = 1; index <= searchIndex; index++) {
                // Check for a depth change
                const { depth } = screens[index]
                if (depth > currentDepth) {
                    currentDepth++
                    path.push(-1)
                }
                if (depth < currentDepth) {
                    currentDepth--
                    path.pop()
                }

                // Increment the path's index for this depth
                path[currentDepth]++
            }

            return path
        }
    }

    return (
        <DrawerContext.Provider
            value={{
                badges,
                setBadge,
                navigation,
                state,
                screenIndex,
                screens,
                ScreenManager,
                hamburgerBadge,
                setHamburgerBadge,
                setDrawerContent
            }}
        >
            {children}
        </DrawerContext.Provider>
    )
}