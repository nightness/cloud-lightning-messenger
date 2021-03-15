import React, { useState } from 'react'
import {
    ImageBackground,
} from 'react-native'
import {
    DrawerContentScrollView,
    DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { FirebaseContext } from '../firebase/FirebaseContext'
import DrawerContentItem from './DrawerContentItem'
import { NavigationParams } from './DrawerParams'

const randomColor = () => '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
// Homer photoURL: https://yt3.ggpht.com/yti/ANoDKi75CjXyn5Omt5Z22dCgKdM_Ey2f9nraM4bYrxuu3A=s88-c-k-c0x00ffffff-no-rj-mo

export const DrawerContent = ({ navigation, ...restProps }: DrawerContentComponentProps) => {
    // Need to grab the stateful theme to determine the best background image
    // Like ../assets/ddd0da2a.png for dark mode
    // Like ../assets/dd426684.png for light mode
    const routeNames = restProps.state.routeNames
    const routes = restProps.state.routes

    const navigateTo = (screenName: string) => {
        navigation.closeDrawer()
        navigation.navigate(screenName)
    }

    return (
        <ImageBackground
            resizeMode='repeat'
            source={require('../assets/dd426684.png')}
            style={{ flex: 1 }}
        >
            <DrawerContentScrollView {...restProps}>
                {routeNames.map((routeName) => {
                    const currentRoute = routes.filter(value => value.name === routeName)?.[0]
                    const params = currentRoute.params as NavigationParams
                    return (
                        <DrawerContentItem
                            navigation={navigation}
                            {...restProps}
                            activeTintColor={params?.activeTintColor}
                            inactiveTintColor={params?.inactiveTintColor}
                            labelText={routeName}
                            iconGroup={params?.iconGroup}
                            iconName={params?.iconName}
                            focusedIconName={params?.focusedIconName}
                            onPress={() => navigateTo(routeName)}
                            key={`route-${routeName}`}
                        />
                    )
                })}
            </DrawerContentScrollView>
        </ImageBackground>
    )
}