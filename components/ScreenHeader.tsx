import React, { useState, useContext, useEffect } from 'react'
import { Badge } from 'react-native-paper'
import { View } from 'react-native'
import { Header } from 'react-native-elements'
import { Image, Text, Icon, ThemeContext } from 'cloud-lightning-themed-ui'
import { LogoutModal } from '../screens/modals/LogoutModal'
import { StackNavigationProp } from '@react-navigation/stack'
import { useAuthState } from '../firebase/Firebase'

interface Props {
    navigation: StackNavigationProp<any>
    title: string
    hamburgerBadgeText?: string
    photoURL?: string | null
    hasDrawerNavigation?: boolean
    hasHome?: boolean
    hasBack?: boolean
}

export default ({
    navigation,
    title,
    photoURL,
    hamburgerBadgeText,
    hasDrawerNavigation = true,
    hasHome = false,
    hasBack = false,
}: Props) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const { activeTheme, setActiveTheme, getThemedComponentStyle } = useContext(ThemeContext)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [showLogout, setShowLogout] = useState(currentUser ? true : false)

    useEffect(() => {
        setShowLogout(currentUser ? true : false)
    }, [currentUser])

    const toggleDarkMode = () => {
        setActiveTheme(activeTheme === 'Dark' ? 'Light' : 'Dark')
    }

    const iconSize = 28

    const centerComponent = (
        <Text fontWeight="600" fontSize={20}>
            {title}
        </Text>
    )
    const leftComponent = (
        <View style={{ flexDirection: 'row' }}>
            {hasDrawerNavigation ? (
                <>
                    <Icon
                        type='material'
                        name='menu'
                        size={iconSize}
                        // @ts-ignore
                        onPress={navigation.openDrawer}
                    />
                    { hamburgerBadgeText ?
                        <Badge style={{ marginLeft: -15 }} size={16} visible={true}>{hamburgerBadgeText}</Badge>
                        : <></>
                    }
                </>
            ) : (
                <></>
            )}
            {hasHome ? (
                <Icon
                    type='material'
                    name='home'
                    size={iconSize}
                    onPress={() => navigation.popToTop()}
                />
            ) : (
                <></>
            )}
            {hasBack ? (
                <Icon
                    type='material'
                    name='navigate-before'
                    size={iconSize}
                    onPress={() => navigation.pop()}
                />
            ) : (
                <></>
            )}
        </View>
    )

    const rightComponent = (
        <View style={{ flexDirection: 'row' }}>
            <Icon
                type='material'
                name='settings-brightness'
                size={iconSize}
                onPress={toggleDarkMode}
            />
            {showLogout ? (
                photoURL ? (
                    <Image
                        source={{ uri: photoURL }}
                        style={{ width: 28, height: 28, borderRadius: 14 }}
                        onPress={() => setShowLogoutModal(true)}
                    />
                ) : (
                    <Icon
                        type='material'
                        name='face'
                        size={iconSize}
                        onPress={() => setShowLogoutModal(true)}
                    />
                )
            ) : (
                <></>
            )}
        </View>
    )

    return (
        <>
            <LogoutModal
                shown={showLogoutModal}
                navigation={navigation}
                dismiss={() => setShowLogoutModal(false)}
            />
            <Header
                containerStyle={{
                    width: '100%',
                    borderBottomColor: getThemedComponentStyle('ScreenHeader')[activeTheme].borderBottomColor,
                }}
                backgroundColor="none"
                //backgroundImageStyle={{}}
                centerComponent={centerComponent}
                leftComponent={leftComponent}
                //leftContainerStyle={{}}
                placement="center"
                rightComponent={rightComponent}
                //rightContainerStyle={{}}
                //statusBarProps={{}}
            />
        </>
    )
}
