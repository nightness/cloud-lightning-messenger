import React, { createContext, useState, useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation';
import { useComponentMounted, useComponentUnmounting } from 'react-use-lifecycles'
import { Defaults } from './Constants'

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [theme, setTheme] = useState(Defaults.defaultTheme)
    const [screenOrientation, setScreenOrientation] = useState(ScreenOrientation.Orientation.UNKNOWN)

    // setState( state => ({ key: value }))

    // Screen orientation state handling
    useComponentMounted(() => {
        ScreenOrientation.unlockAsync()
            .catch(err => console.warn(err))
        ScreenOrientation.getOrientationAsync()
            .then(value => {
                setScreenOrientation(value)
                ScreenOrientation.lockAsync(value)
                    .catch(err => console.warn(err))
            })
            .catch(err => console.warn(err))

        ScreenOrientation.addOrientationChangeListener(
            value => setScreenOrientation(value.orientationInfo.orientation)
        )
    })

    useComponentUnmounting(() => ScreenOrientation.removeOrientationChangeListeners())

    return (
        <GlobalContext.Provider value={{ theme, setTheme, screenOrientation }}>
            {children}
        </GlobalContext.Provider>
    )
}
