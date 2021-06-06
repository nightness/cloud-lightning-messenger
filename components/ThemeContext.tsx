import React, { createContext, useState, useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Keyboard, Platform, StyleProp, TextStyle, useWindowDimensions, ViewStyle } from 'react-native'
import { Theme, Themes, ThemeStyles, ThemeType } from '../app/ThemeTypes'
// @ts-ignore
import { ModalPortal } from 'react-native-modals'
import { StatusBar, StatusBarStyle } from 'expo-status-bar'

type Orientation = ScreenOrientation.Orientation

export interface Size {
    width: number
    height: number
}

type ContextType = {
    activeTheme: Theme
    setActiveTheme: (theme: Theme) => void
    themes?: any[]
    styles?: any[]
    screenOrientation: ScreenOrientation.Orientation
    isKeyboardOpen: boolean
    keyboardHeight: number
    window?: Size
    getThemedComponentStyle: (componentName: string, isDisabled?: boolean, hasFocus?: boolean) => ThemeType
}

export const ThemeContext = createContext<ContextType>({
    activeTheme: 'Light',
    setActiveTheme: (theme: Theme) => undefined,
    isKeyboardOpen: false,
    keyboardHeight: 0,
    screenOrientation: ScreenOrientation.Orientation.UNKNOWN,
    getThemedComponentStyle: (componentName: string, isDisabled?: boolean, hasFocus?: boolean) => ({
        Light: {},
        Dark: {}
    })
})

interface Props {
    children: JSX.Element
    themes: Themes
}

export const ThemeProvider = ({ themes, children }: Props) => {
    const { width, height } = useWindowDimensions()
    const [activeTheme, setActiveTheme] = useState<Theme>('Light')
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false)
    const [
        screenOrientation,
        setScreenOrientation,
    ] = useState<ScreenOrientation.Orientation>(ScreenOrientation.Orientation.UNKNOWN)

    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    useEffect(() => {
        if (Platform.OS === 'web') return

        Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
        }
    }, [])

    const keyboardDidShow = (frames: any) => {
        setIsKeyboardOpen(true)
        setKeyboardHeight(frames.endCoordinates.height)
    }

    const keyboardDidHide = () => {
        setIsKeyboardOpen(false)
        setKeyboardHeight(0)
    }

    // Screen orientation state handling
    useEffect(() => {
        if (Platform.OS === 'web') return

        ScreenOrientation.unlockAsync().catch((err: Error) => console.warn(err))
        ScreenOrientation.getOrientationAsync()
            .then((value: Orientation) => {
                setScreenOrientation(value)
            })
            .catch((err: Error) => console.warn(err))

        ScreenOrientation.addOrientationChangeListener((value) =>
            setScreenOrientation(value.orientationInfo.orientation)
        )

        return ScreenOrientation.removeOrientationChangeListeners
    })

    const getThemedComponentStyle = (componentName: string, isDisabled?: boolean, hasFocus?: boolean) => {
        if (isDisabled)
            componentName += 'Disabled'
        for (let i = 0; i < themes.length; i++) {
            const theme = themes[i]
            if (theme[0] === componentName)
                return theme[1]
        }
        console.info(`No theme provided for '${componentName}' components... Default theme used.`)
        return ({
            Light: { background: 'white', color: 'black' },
            Dark: { background: 'black', color: 'white' }
        })
    }

    const getStatusBarStyle = () => {
        if (activeTheme === 'Dark')
            return ('light' as StatusBarStyle)
        return ('dark' as StatusBarStyle)
    }

    return (
        <ThemeContext.Provider value={{
            activeTheme,
            setActiveTheme,
            getThemedComponentStyle,
            screenOrientation,
            isKeyboardOpen, keyboardHeight,
            window: {
                height,
                width
            }
        }}>
            {children}
            <StatusBar style={getStatusBarStyle()} />
            <ModalPortal />
        </ThemeContext.Provider>
    )
}

