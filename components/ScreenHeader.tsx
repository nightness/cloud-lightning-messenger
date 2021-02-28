import React, { useState, useContext } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Header } from 'react-native-elements'
import { Image, Text, MaterialIcons } from './Components'
import { LogoutModal } from '../screens/Authentication'
import { Themes, Theme } from '../shared/Themes'

interface Props {
    navigation: any
    title: string
    photoURL?: string | null
    hasDrawerNavigation?: boolean
    hasHome?: boolean
    hasBack?: boolean
    hasLogout?: boolean
}

export default ({
    navigation,
    title,
    photoURL,
    hasDrawerNavigation = true,
    hasHome = true,
    hasBack = false,
    hasLogout = true,
}: Props) => {
    const { theme, setTheme } = useContext(GlobalContext)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const toggleDarkMode = () => {
        if (!setTheme) return
        if (theme === Theme.Light) {
            setTheme(Theme.Dark)
        } else {
            setTheme(Theme.Light)
        }
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
                <MaterialIcons
                    name="menu"
                    size={iconSize}
                    onPress={navigation.openDrawer}
                />
            ) : (
                <></>
            )}
            {hasHome ? (
                <MaterialIcons
                    name="home"
                    size={iconSize}
                    onPress={() => navigation.popToTop()}
                />
            ) : (
                <></>
            )}
            {hasBack ? (
                <MaterialIcons
                    name="navigate-before"
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
            <MaterialIcons
                name="settings-brightness"
                size={iconSize}
                onPress={toggleDarkMode}
            />
            {hasLogout ? (
                photoURL ? (
                    <Image
                        source={{ uri: photoURL }}
                        style={{ width: 28, height: 28, borderRadius: '50%' }}
                        onPress={() => setShowLogoutModal(true)}
                    />
                ) : (
                    <MaterialIcons
                        name="face"
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
                    borderBottomColor: Themes.screen[theme].borderBottomColor,
                }}
                backgroundColor="none"
                backgroundImageStyle={{}}
                centerComponent={centerComponent}
                leftComponent={leftComponent}
                leftContainerStyle={{}}
                placement="center"
                rightComponent={rightComponent}
                rightContainerStyle={{}}
                statusBarProps={{}}
            />
        </>
    )
}
