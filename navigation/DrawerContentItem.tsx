import React from 'react'
import { StyleProp, TextStyle, ViewStyle, View } from 'react-native'
import { DrawerItem } from '@react-navigation/drawer'
import { Icon } from 'react-native-elements'
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types'
import { Text, Badge } from 'react-native-elements'

declare type Props = {
    /**
     * The label text of the item.
     */
    labelText: string;
    badgeText?: string;
    /**
     * Icons to display for the `DrawerItem`.
     */
    iconGroup?: string;
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

export default ({ focusedIconName, iconGroup, iconName, focused, labelText, badgeText, ...restProps }: Props) => {
    return (
        <DrawerItem            
            pressOpacity='90%'
            focused={focused}
            label={({ focused, color }) => (
                <View style={{ flex: 1, marginLeft: -15, flexDirection: 'row' }}>
                    <Text style={{ flex: 3, fontWeight: '600' }}>{labelText}</Text>
                    { badgeText ?
                        <Badge badgeStyle={{ height: 22 }}>{badgeText}</Badge>
                        : <></>
                    }
                </View>
            )}
            icon={({ focused, color, size }) => {
                return (
                    <Icon color={color} size={size} name={iconName} type={iconGroup} />
                )
            }}
            {...restProps}
        />
    )
}
