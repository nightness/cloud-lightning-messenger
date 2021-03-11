import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerContentComponentProps,
    DrawerItemList,
} from '@react-navigation/drawer'
import { Icon } from 'react-native-elements'
import DrawerContentItem from './DrawerContentItem'


export default (props: DrawerContentComponentProps) => {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerContentItem
                {...props}
                activeTintColor='#d55'
                inactiveTintColor='#055'
                label='Help'
                iconName='help'
                focusedIconName='help_outline'
                onPress={() => console.log('click')}
            />

        </DrawerContentScrollView>
    )
}