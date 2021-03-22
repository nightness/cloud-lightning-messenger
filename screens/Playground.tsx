import React, { useEffect, useContext, useState } from 'react'
import { DefaultRouterOptions } from '@react-navigation/native'
import {
    Button,
    Screen,
    Text,
} from '../components/Components'
import { DrawerContext } from '../navigation/DrawerContext'

interface Props {
    navigation: DefaultRouterOptions
}

// Playground
export const Playground = ({ navigation }: Props) => {
    const { setBadge } = useContext(DrawerContext)
    return (
        <Screen navigation={navigation} title="Playground">
            <Button
                title='Set the badge for "Home" to "Hello"'
                onPress={() => {
                    setBadge('Home', 'Hello')
                }}
            />
        </Screen>
    )
}
