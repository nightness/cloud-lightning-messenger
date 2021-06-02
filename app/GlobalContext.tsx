import React, { createContext, useState, useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'
import { Keyboard, Platform, useWindowDimensions, ViewStyle } from 'react-native'
//import Toast, { AnyObject, ToastPosition } from "react-native-toast-message"
import { Toast, ToastMessageProps } from '../components/Toast'

// interface ShowToastProps {
//     type: string,
//     position?: ToastPosition,
//     text1?: string,
//     text2?: string,
//     visibilityTime?: number,
//     autoHide?: boolean,
//     topOffset?: number,
//     bottomOffset?: number,
//     props?: AnyObject,
//     onShow?: () => void,
//     onHide?: () => void,
//     onPress?: () => void
// }

type ContextType = {
    hamburgerBadgeText?: string
    setHamburgerBadgeText?: React.Dispatch<React.SetStateAction<string | undefined>>
    sendNotificationImmediately?: (title: string, body: string) => Promise<void>
    //showToast: (options: ShowToastProps) => void
    showToast: (title: string, body: string) => void
    hideToast: () => void
}

if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    })
}

const askMicrophonePermission = async () => {
    const result = await Audio.getPermissionsAsync()
    let finalStatus = result.status
    if (result.status !== "granted") {
        const { status } = await Audio.requestPermissionsAsync()
        finalStatus = status
    }
    if (finalStatus !== "granted") {
        return false
    }
    return true
}

const askCameraPermission = async () => {
    const result = await Camera.getPermissionsAsync()
    let finalStatus = result.status
    if (result.status !== "granted") {
        const { status } = await Camera.requestPermissionsAsync()
        finalStatus = status
    }
    if (finalStatus !== "granted") {
        return false
    }
    return true
}

const askPermissions = async () => {
    const result = await Notifications.getPermissionsAsync()
    let finalStatus = result.status
    if (result.status !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }
    if (finalStatus !== "granted") {
        return false
    }
    return true
}

export const GlobalContext = createContext<ContextType>({
    // Defaults
    //showToast: (options: ShowToastProps) => console.log(options), //Toast.show(options),
    showToast: (title: string, body: string) => console.log(`${title} - ${body}`),
    hideToast: () => console.log(`Toast.hide()`)
})

interface Props {
    children: JSX.Element
}

export const GlobalProvider = ({ children }: Props) => {
    const [hamburgerBadgeText, setHamburgerBadgeText] = useState<string>()
    const [messages, setMessages] = useState<ToastMessageProps[]>([]);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            askPermissions()
                .then(() => {
                    Notifications.addNotificationReceivedListener((event) => {
                        console.log(event)
                    })
                })
                .finally(() => {
                    askCameraPermission()
                        .then(() => {
                            askMicrophonePermission()
                                .then((result) => {
                                    console.log(result)
                                })
                        })
                })
        }
    }, [])

    // If finer control is needed, these can be customized more
    const showToast = (title: string, body: string) => setMessages([...messages, {
        title,
        message: body
    }])
    const hideToast = () => console.log(`Toast.hide()`)
    const sendNotificationImmediately = async (title: string, body: string) => {
        if (Platform.OS === 'web') {
            return showToast(title, body)
        }
        await Notifications.presentNotificationAsync({ title, body });
    }

    return (
        <GlobalContext.Provider value={{
            hamburgerBadgeText, setHamburgerBadgeText, showToast, hideToast, sendNotificationImmediately
        }}>
            {/* { messages.length > 0 ?
                <Toast messages={messages} /> : <></>
            } */}
            {children}
        </GlobalContext.Provider>
    )
}
