import React, { useContext, useState } from 'react'
import { ImageBackground, View } from 'react-native'
import { Orientation } from 'expo-screen-orientation'
import {
    DrawerContentScrollView,
    // DrawerContent,
    DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { LinearGradient } from 'expo-linear-gradient'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { DrawerContext } from './DrawerContext'
import DrawerContentItem from './DrawerContentItem'
import { NavigationParams } from './DrawerParams'
import { GlobalContext } from '../shared/GlobalContext'
import { GradientColors } from '../shared/GradientColors'
import { SafeAreaView } from 'react-native-safe-area-context'

const randomColor = () => '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
// Homer photoURL: https://yt3.ggpht.com/yti/ANoDKi75CjXyn5Omt5Z22dCgKdM_Ey2f9nraM4bYrxuu3A=s88-c-k-c0x00ffffff-no-rj-mo

interface RouteParameters {
    theme: 'Light' | 'Dark'
    isDrawerOpen: boolean
    screenOrientation: Orientation
}

export const DrawerContent = ({ navigation, ...restProps }: DrawerContentComponentProps) => {
    const { getBadges } = useContext(DrawerContext)
    const { theme } = useContext(GlobalContext)

    const state = restProps.state;
    const routeNames = state.routeNames
    const routes = state.routes

    const navigateTo = (screenName: string) => {
        navigation.closeDrawer()
        navigation.navigate(screenName)
    }

    return (
        <LinearGradient
            colors={GradientColors[theme].drawer}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
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
                                badgeText={getBadges(routeName)}
                            />
                        )
                    })}
                </DrawerContentScrollView>
            </SafeAreaView>
        </LinearGradient>
    )
}