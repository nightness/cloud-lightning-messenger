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
import { GlobalContext } from '../shared/GlobalContext'
import { ProfileContext } from '../shared/ProfileContext'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const [name, setName] = useState<string>()
    const profileCache = useContext(ProfileContext)
    const { screenOrientation, setHamburgerBadgeText } = useContext(GlobalContext)
    const expoURL = 'exp://exp.host/@nightness/cloud-lightning-messenger'

    // useEffect(() => {
    //     setHamburgerBadgeText?.('I love programming')
    // }, [])

    useEffect(() => {
        console.log(`ScreenOrientation: ${screenOrientation}`)
    }, [screenOrientation])

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
                <View>
                    <Text>{`Welcome ${name}`}</Text>
                    {Platform.OS === 'web' ?
                        <>
                            <Text>{
                                `Beta 1 of the mobile apps is available though the Expo app (available in both the ` +
                                `Google Play Store and Apple App Store). ` +
                                `If you are viewing this from a mobile device click the button below. ` +
                                `If you are viewing this on a desktop, access your camera and scan the QR code instead.`
                            }</Text>
                            <Button
                                style={{ margin: 25 }}
                                title='Run Native App'
                                onPress={() => {
                                    Linking.canOpenURL(expoURL).then(supported => {
                                        if (supported) {
                                            Linking.openURL(expoURL);
                                        } else {
                                            alert('You need to install the Expo app first!')
                                        }
                                    });
                                }}
                            />
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
                        </>
                        : <></>
                    }
                </View>
            }
        </Screen>
    )
}
