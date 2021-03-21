import React, { createContext, useState, useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as Notifications from 'expo-notifications'
import * as Defaults from './Defaults'
import { Theme } from './Themes'
import { Keyboard, Platform, useWindowDimensions } from 'react-native'
import { Constants } from 'expo'
import { useKeyboardHeight } from './Hooks'

type Orientation = ScreenOrientation.Orientation

export interface Size {
    width?: number
    height?: number
}

type ContextType = {
    theme: Theme
    setTheme?: (theme: Theme) => void
    screenOrientation: ScreenOrientation.Orientation
    isKeyboardOpen: boolean
    keyboardHeight: number
    hamburgerBadgeText?: string
    setHamburgerBadgeText?: React.Dispatch<React.SetStateAction<string | undefined>>
    window: Size
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const GlobalContext = createContext<ContextType>({
    theme: Defaults.defaultTheme,
    isKeyboardOpen: false,
    keyboardHeight: 0,
    screenOrientation: ScreenOrientation.Orientation.UNKNOWN,
    window: {}
})

interface Props {
    children: JSX.Element
}

export const GlobalProvider = ({ children }: Props) => {
    const { width, height } = useWindowDimensions()
    const [theme, setTheme] = useState<Theme>(Defaults.defaultTheme)
    const [hamburgerBadgeText, setHamburgerBadgeText] = useState<string>()
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false)
    const [
        screenOrientation,
        setScreenOrientation,
    ] = useState<ScreenOrientation.Orientation>(ScreenOrientation.Orientation.UNKNOWN)

    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    useEffect(() => {
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
        ScreenOrientation.unlockAsync().catch((err) => console.warn(err))
        ScreenOrientation.getOrientationAsync()
            .then((value: Orientation) => {
                console.info(screenOrientation)
                setScreenOrientation(value)
            })
            .catch((err) => console.warn(err))

        ScreenOrientation.addOrientationChangeListener((value) =>
            setScreenOrientation(value.orientationInfo.orientation)
        )

        return ScreenOrientation.removeOrientationChangeListeners
    })

    return (
        <GlobalContext.Provider value={{
            theme, setTheme,
            screenOrientation,
            isKeyboardOpen, keyboardHeight,
            hamburgerBadgeText, setHamburgerBadgeText,
            window: {
                height,
                width
            }
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}