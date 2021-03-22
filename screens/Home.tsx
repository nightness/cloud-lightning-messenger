import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState, useEffect, useContext, PureComponent } from 'react'
import { Linking, Platform } from 'react-native'
import {
    Screen,
    Button,
    Container,
    Text,
    ActivityIndicator,
    View,
    Image
} from '../components/Components'
import { GlobalContext } from '../app/GlobalContext'
import { ProfileContext } from '../app/ProfileContext'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const [name, setName] = useState<string>()
    const profileCache = useContext(ProfileContext)
    const expoURL = 'exp://exp.host/@nightness/cloud-lightning-messenger'
    const [baseOperatingSystem, setBaseOperatingSystem] = useState<string>('unknown')

    useEffect(() => {
        /*  This is used by the web version of the app to either display
            a QR code or a button to launch Expo Go */         
        if (Platform.OS === 'web') {
            // Loading this module is crashing the native apps so it being loaded dynamically
            const devInfo = require('react-native-device-info')
            devInfo.getBaseOs()
                .then((os: string) => setBaseOperatingSystem(os))
                .catch(() => undefined)
        }
    }, [])

    // useEffect(() => {
    //     setHamburgerBadgeText?.('I love programming')
    // }, [])

    // useEffect(() => {
    //     console.log(`ScreenOrientation: ${screenOrientation}`)
    // }, [screenOrientation])

    useEffect(() => {
        if (!profileCache) return
        const username = profileCache.getUserName()
        if (username) {
            setName(username)
        }
    }, [profileCache.cachedUsers])

    return (
        <Screen navigation={navigation} title="Home">
            { profileCache.isFetching ? <ActivityIndicator /> :
                <View style={{ margin: 3 }}>
                    <Text>{`Welcome ${name}`}</Text>
                    {Platform.OS === 'web' ?
                        <>
                            <Text>{
                                `\nBeta 1 of the mobile app is available. To try it, first install the 'Expo Go' app on your mobile device. ` +
                                `Expo Go is a free app that allows for distribution and testing of others apps during development. ` +
                                `It's available on both the Google Play Store and iOS App Store. ` +
                                `After installing Expo Go, ` +
                                (baseOperatingSystem == 'iOS' || baseOperatingSystem == 'Android' ?
                                    `click the button below.` :
                                    `access your camera and scan the QR code below.`)
                            }</Text>
                            {(baseOperatingSystem == 'iOS' || baseOperatingSystem == 'Android' ?
                                <Button
                                    style={{ margin: 25 }}
                                    title='Launch Cloud Lightning Messenger'
                                    onPress={() => {
                                        try {
                                            Linking.canOpenURL(expoURL).then(supported => {
                                                if (supported) {
                                                    Linking.openURL(expoURL);
                                                } else {
                                                    alert('You need to install the Expo app first!')
                                                }
                                            });
                                        } catch (err) {
                                            alert('You need to install the Expo app first!')
                                            console.log(err)
                                        }
                                    }}
                                /> :
                                <Image
                                    style={{
                                        height: 200,
                                        width: 200,
                                        alignSelf: 'center',
                                        margin: 30,
                                        resizeMode: 'center',
                                    }}
                                    source={require('../assets/expo-qr.png')}
                                />
                            )}
                        </>
                        : <></>
                    }
                    {/* <Text style={{ textDecorationLine: 'underline', fontWeight: 'bold' }}>System Information</Text>
                    <Text>
                        {
                            `\tBaseOperatingSystem: ${baseOperatingSystem}\n` +
                            `\tsystemName: ${systemName}\n` +
                            `\tscreenOrientation: ${screenOrientation}\n` +
                            ``
                        }
                    </Text> */}
                </View>
            }
        </Screen>
    )
}
