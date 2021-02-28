import React, { createContext, useState, useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as Defaults from './Defaults'
import { Theme } from './Themes'

type ContextType = {
    theme: Theme
    setTheme?: (theme: Theme) => void
    screenOrientation?: ScreenOrientation.Orientation
}

export const GlobalContext = createContext<ContextType>({
    theme: Defaults.defaultTheme,
})

interface Props {
    children: JSX.Element
}

export const GlobalProvider = ({ children }: Props) => {
    const [theme, setTheme] = useState<Theme>(Defaults.defaultTheme)
    const [
        screenOrientation,
        setScreenOrientation,
    ] = useState<ScreenOrientation.Orientation>(ScreenOrientation.Orientation.UNKNOWN)

    // Screen orientation state handling
    useEffect(() => {
        ScreenOrientation.unlockAsync().catch((err) => console.warn(err))
        ScreenOrientation.getOrientationAsync()
            .then((value: ScreenOrientation.Orientation) => {
                setScreenOrientation(value)
                // @ts-ignore
                ScreenOrientation.lockAsync(value).catch((err) => console.warn(err))
            })
            .catch((err) => console.warn(err))

        ScreenOrientation.addOrientationChangeListener((value) =>
            setScreenOrientation(value.orientationInfo.orientation)
        )
    }, [])

    // Clean-up
    useEffect(() => () => ScreenOrientation.removeOrientationChangeListeners())

    return (
        <GlobalContext.Provider value={{ theme, setTheme, screenOrientation }}>
            {children}
        </GlobalContext.Provider>
    )
}
