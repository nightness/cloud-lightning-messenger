import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground
} from 'react-native'
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerContentComponentProps,
    DrawerItemList,
} from '@react-navigation/drawer'
import { Icon } from 'react-native-elements'
import DrawerContentItem from './DrawerContentItem'
import { GlobalContext } from '../shared/GlobalContext'

const randomColor = () => '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
// Homer photoURL: https://yt3.ggpht.com/yti/ANoDKi75CjXyn5Omt5Z22dCgKdM_Ey2f9nraM4bYrxuu3A=s88-c-k-c0x00ffffff-no-rj-mo

export const DrawerContent = ({ navigation, ...restProps }: DrawerContentComponentProps) => {
    // Need to grab the theme to determine the best background image
    // This is not hookable 
    // Like ../assets/ddd0da2a.png for dark mode
    // Like ../assets/dd426684.png for light mode

    return (
        <ImageBackground
            resizeMode='repeat'
            source={require('../assets/dd426684.png')}
            style={{ flex: 1 }}
        >
            <DrawerContentScrollView {...restProps}>
                <DrawerItemList navigation={navigation} {...restProps} />
                <DrawerContentItem
                    navigation={navigation}
                    {...restProps}
                    activeTintColor={randomColor()}
                    inactiveTintColor={randomColor()}
                    label='Help'
                    iconName='help'
                    focusedIconName='help_outline'
                    onPress={() => console.log('click')}
                />

            </DrawerContentScrollView>
        </ImageBackground>
    )
}