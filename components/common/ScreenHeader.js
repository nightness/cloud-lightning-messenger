import React, { useState, useContext } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Header, Icon } from "react-native-elements";
import { Text, Button, Modal } from './Components'
import { MaterialIcons } from '@expo/vector-icons'
import { LogoutModal } from '../Authentication'
import { Themes, Styles } from '../shared/Constants'

export default ({ navigation, title, hasBurger, hasHome, hasBack, hasLogout }) => {
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

    const iconColor = Themes.textInputPlaceHolder[theme].color
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
                    borderBottomRightRadius: 3,
                    borderBottomLeftRadius: 3,
                    borderBottomColor: Themes.screen[theme].borderBottomColor // No bottom border
                }}
                backgroundColor='none'
                backgroundImageStyle={{}}
                centerComponent={() =>
                    <Text fontWeight="600" fontSize={20}>{title}</Text>
                }
                leftComponent={() =>
                    <View style={{ flexDirection: 'row' }}>
                        {(hasBurger) ?
                            <MaterialIcons
                                name="menu"
                                style={Styles.screen.icons}
                                size={iconSize}
                                onPress={openMenu}
                                color={iconColor}
                                selectable={false} />
                            : <></>}
                        {(hasHome) ?
                            <MaterialIcons
                                name="home"
                                style={Styles.screen.icons}
                                size={iconSize}
                                onPress={() => navigation.popToTop()}
                                color={iconColor}
                                selectable={false} />
                            : <></>}
                        {(hasBack) ?
                            <MaterialIcons
                                name="navigate-before"
                                style={Styles.screen.icons}
                                size={iconSize}
                                onPress={() => navigation.pop()}
                                color={iconColor}
                                selectable={false} />
                            : <></>}
                    </View>
                }
                leftContainerStyle={{}}
                placement="center"
                rightComponent={() =>
                    <View style={{ flexDirection: 'row' }}>
                        <MaterialIcons
                            name="settings-brightness"
                            style={Styles.screen.icons}
                            size={iconSize}
                            onPress={toggleDarkMode}
                            color={iconColor}
                            selectable={false} />
                        {hasLogout ?
                            <MaterialIcons
                                name="face"
                                style={Styles.screen.icons}
                                size={iconSize}
                                onPress={() => setShowLogoutModal(true)}
                                color={iconColor}
                                selectable={false} />
                            : <></>}
                    </View>
                }
                rightContainerStyle={{}}
                statusBarProps={{}}
            />
        </>
    )
}
