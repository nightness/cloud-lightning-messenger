import React, { createContext, useState, useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import { Keyboard, Platform, useWindowDimensions } from 'react-native'


type ContextType = {
    hamburgerBadgeText?: string
    setHamburgerBadgeText?: React.Dispatch<React.SetStateAction<string | undefined>>
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const GlobalContext = createContext<ContextType>({
    // Defaults    
})

interface Props {
    children: JSX.Element
}

export const GlobalProvider = ({ children }: Props) => {
    const [hamburgerBadgeText, setHamburgerBadgeText] = useState<string>()

    return (
        <GlobalContext.Provider value={{
            hamburgerBadgeText, setHamburgerBadgeText,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}
