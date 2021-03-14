import React, { useEffect, useState } from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { DrawerItem } from '@react-navigation/drawer'
import { Icon } from 'react-native-elements'
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types'
import { View, Text } from '../components/Components'
import { Badge } from 'react-native-paper'
import { Styles } from '../shared/Styles'

declare type Props = {
    /**
     * The label text of the item.
     */
    labelText: string;
    badgeText?: string;
    /**
     * Icons to display for the `DrawerItem`.
     */
    iconName: string;
    focusedIconName?: string;
    /**
     * URL to use for the link to the tab.
     */
    to?: string;
    /**
     * Whether to highlight the drawer item as active.
     */
    focused?: boolean;
    /**
     * Function to execute on press.
     */
    onPress: () => void;
    /**
     * Color for the icon and label when the item is active.
     */
    activeTintColor?: string;
    /**
     * Color for the icon and label when the item is inactive.
     */
    inactiveTintColor?: string;
    /**
     * Background color for item when its active.
     */
    activeBackgroundColor?: string;
    /**
     * Background color for item when its inactive.
     */
    inactiveBackgroundColor?: string;
    /**
     * Color of the touchable effect on press.
     * Only supported on Android.
     *
     * @platform android
     */
    pressColor?: string;
    /**
     * Opacity of the touchable effect on press.
     * Only supported on iOS.
     *
     * @platform ios
     */
    pressOpacity?: string;
    /**
     * Style object for the label element.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * Style object for the wrapper element.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * navigation prop
     */
    navigation: DrawerNavigationHelpers
}

export default ({ focusedIconName, iconName, focused, labelText, badgeText, ...restProps }: Props) => {
    // const [name, setName] = useState<string>(iconName)

    // useEffect(() => {
    //     setName(focused && focusedIconName ? focusedIconName : iconName)
    // }, [focused])

    return (
        <DrawerItem
            pressOpacity='90%'
            focused={focused}
            label={({ focused, color }) => (
                <View style={{ flex: 1, marginLeft: -15, flexDirection: 'row' }}>
                    <Text fontWeight='600' style={{ flex: 3 }}>{labelText}</Text>
                    { badgeText ?
                        <Badge size={22} visible={true}>{badgeText}</Badge>
                        : <></>
                    }
                </View>
            )}
            icon={({ focused, color, size }) => {
                console.log(`focused=${focused}, color=${color}, size=${size}, iconName=${iconName} focusedIconName=${focusedIconName}`)
                return (
                    <Icon color={color} size={size} name={iconName} />
                )
            }}
            {...restProps}
        />
    )
}
