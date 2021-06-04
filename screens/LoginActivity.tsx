import React, { useEffect } from 'react'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import Screen from '../components/Screen'
import { ActivityIndicator } from '../components'
import { getAuth } from '../database/Firebase'

interface Props {
    navigation: DrawerNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const { currentUser } = getAuth()
    useEffect(() => {
        if (currentUser)
            // @ts-expect-error
            navigation.replace('Main')
    }, [currentUser])
    return (
        <Screen navigation={navigation} title="">
            <ActivityIndicator />
        </Screen>
    )
}
