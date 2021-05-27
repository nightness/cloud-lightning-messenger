import React, { createContext, useState, useEffect, useRef } from 'react'
//import * as Notifications from 'expo-notifications'
//import * as Permissions from "expo-permissions"
import { Keyboard, Platform, useWindowDimensions } from 'react-native'
import Toast from "react-native-toast-message"


type ContextType = {
    hamburgerBadgeText?: string
    setHamburgerBadgeText?: React.Dispatch<React.SetStateAction<string | undefined>>
    sendNotificationImmediately?: (title: string, body: string) => Promise<void>
}

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: true,
//     }),
// });

// const askPermissions = async () => {
//     const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
//     let finalStatus = existingStatus
//     if (existingStatus !== "granted") {
//         const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
//         finalStatus = status
//     }
//     if (finalStatus !== "granted") {
//         return false
//     }
//     return true
// }

// const sendNotificationImmediately = async (title: string, body: string) => {
//     let notificationId = await Notifications.presentNotificationAsync({ title, body });
//     console.log(notificationId); // can be saved in AsyncStorage or send to server
// };

export const GlobalContext = createContext<ContextType>({
    // Defaults    
})

interface Props {
    children: JSX.Element
}

export const GlobalProvider = ({ children }: Props) => {
    const [hamburgerBadgeText, setHamburgerBadgeText] = useState<string>()
    const toast = useRef<Toast>(null);

    useEffect(() => {
        // askPermissions()
        //     .then(() => {
        //         Notifications.addNotificationReceivedListener((event) => {
        //             console.log(event)
        //         })
        //     })
    }, [])

    return (
        <GlobalContext.Provider value={{
            hamburgerBadgeText, setHamburgerBadgeText, //, sendNotificationImmediately
        }}>
            {children}
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </GlobalContext.Provider>
    )
}
