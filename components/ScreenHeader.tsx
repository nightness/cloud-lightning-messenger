import React, { useState, useContext } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Header } from 'react-native-elements'
import { Image, Text, MaterialIcons } from './Components'
import { LogoutModal } from '../screens/modals/LogoutModal'
import { Themes, Theme } from '../shared/Themes'
import { StackNavigationProp } from '@react-navigation/stack'

interface Props {
    navigation: StackNavigationProp<any>
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
    hasHome = false,
    hasBack = false,
    hasLogout = false,
}: Props) => {
    const { theme, setTheme } = useContext(GlobalContext)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const toggleDarkMode = () => {
        if (!setTheme) return
        if (theme === 'Light') {
            setTheme('Dark')
        } else {
            setTheme('Light')
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
                    // @ts-ignore
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
