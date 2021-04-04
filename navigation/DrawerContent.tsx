import React, { useContext, useEffect, useState } from 'react'
import {
    DrawerContentScrollView,
    DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { LinearGradient } from 'expo-linear-gradient'
import { DrawerContext } from './DrawerContext'
import DrawerContentItem from './DrawerContentItem'
import { NavigationElements, NavigationParams } from './NavigationTypes'
import { GradientColors } from '../app/GradientColors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'
import { GlobalContext } from '../app/GlobalContext'

export const DrawerContent = (props: DrawerContentComponentProps) => {
    const { theme } = useContext(GlobalContext)
    const { badges, screens, setDrawerContent } = useContext(DrawerContext)
    const { state, navigation } = props;
    const { routeNames, routes } = state
    const navigateTo = (screenName: string) => {
        navigation.closeDrawer()
        navigation.navigate(screenName)
    }

    let parentStack: NavigationElements = []
    let currentDepth = 0

    useEffect(() => {
        setDrawerContent(navigation, state)
    })

    return (
        <LinearGradient
            colors={GradientColors[theme].drawer}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <DrawerContentScrollView bounces={false} {...props}>
                    {routeNames.map((routeName, routeIndex) => {
                        const currentRoute = routes.filter(value => value.name === routeName)?.[0]
                        const params = currentRoute.params as NavigationParams
                        const { label, depth, isHidden } = screens[routeIndex]
                        if (depth > currentDepth) {
                            currentDepth++
                            parentStack.push(screens[routeIndex - 1])
                        }
                        else if (depth < currentDepth) {
                            currentDepth--
                            parentStack.pop()
                        }
                        const theHidden = parentStack.filter((item) => item.isHidden)
                        const isVisible =
                            !isHidden &&
                            !parentStack[0]?.isCollapsed &&
                            (depth === 0 || theHidden.length === 0)

                        if (!isVisible)
                            return (<View key={`${routeName}-${Math.random()}`}></View>)

                        return (
                            <DrawerContentItem
                                {...props}
                                activeTintColor={params?.activeTintColor}
                                inactiveTintColor={params?.inactiveTintColor}
                                labelText={label}
                                iconGroup={params?.iconGroup}
                                iconName={params?.iconName}
                                focusedIconName={params?.focusedIconName}
                                onPress={() => navigateTo(routeName)}
                                key={`route-${routeName}-${Math.random()}`}
                                badgeText={badges[routeName] as string}
                                style={{ marginLeft: (15 * depth) }}  // ToDo
                            />
                        )
                    })}
                </DrawerContentScrollView>
            </SafeAreaView>
        </LinearGradient>
    )
}
