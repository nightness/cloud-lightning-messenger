import React, { useState, useContext } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Header, Icon } from "react-native-elements";
import { Text, MaterialIcons } from './Components'
import { LogoutModal } from '../Authentication'
import { Themes, Styles } from '../shared/Constants'

export default ({ navigation, title, hasDrawerNavigation = true, hasHome, hasBack, hasLogout = true }) => {
    const { theme, setTheme } = useContext(GlobalContext)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const openMenu = () => {
        navigation.openDrawer()
    }

    const toggleDarkMode = () => {
        if (theme === "Dark") {
            setTheme("Light")
        } else {
            setTheme("Dark")
        }
    }

    const iconSize = 28

    return (
        <>
            <LogoutModal
                shown={showLogoutModal}
                navigation={navigation}
                dismiss={() => setShowLogoutModal(false)}
            />
            <Header
                containerStyle={{
                    width: "100%",
                    borderBottomColor: Themes.screen[theme].borderBottomColor
                }}
                backgroundColor='none'
                backgroundImageStyle={{}}
                centerComponent={() =>
                    <Text fontWeight="600" fontSize={20}>{title}</Text>
                }
                leftComponent={() =>
                    <View style={{ flexDirection: 'row' }}>
                        {(hasDrawerNavigation) ?
                            <MaterialIcons
                                name="menu"
                                size={iconSize}
                                onPress={openMenu} />
                            : <></>}
                        {(hasHome) ?
                            <MaterialIcons
                                name="home"
                                size={iconSize}
                                onPress={() => navigation.popToTop()} />
                            : <></>}
                        {(hasBack) ?
                            <MaterialIcons
                                name="navigate-before"
                                size={iconSize}
                                onPress={() => navigation.pop()} />
                            : <></>}
                    </View>
                }
                leftContainerStyle={{}}
                placement="center"
                rightComponent={() =>
                    <View style={{ flexDirection: 'row' }}>
                        <MaterialIcons
                            name="settings-brightness"
                            size={iconSize}
                            onPress={toggleDarkMode} />
                        {hasLogout ?
                            <MaterialIcons
                                name="face"
                                size={iconSize}
                                onPress={() => setShowLogoutModal(true)} />
                            : <></>}
                    </View>
                }
                rightContainerStyle={{}}
                statusBarProps={{}}
            />
        </>
    )
}
