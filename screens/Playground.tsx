import React, { useEffect, useContext, useState } from 'react'
import { DefaultRouterOptions } from '@react-navigation/native'
import {
    Button,
    Screen,
    Text,
} from '../components/Components'
import { DrawerContext } from '../navigation/DrawerContext'
import { callFirebaseFunction } from '../firebase/Firebase'

interface Props {
    navigation: DefaultRouterOptions
}

// Playground
export const Playground = ({ navigation }: Props) => {
    const { setBadge, screensManager } = useContext(DrawerContext)
    return (
        <Screen navigation={navigation} title="Playground">
            <Button
                title='Join a channel'
                onPress={() => {
                    callFirebaseFunction('joinGroup', {
                        groupId: `gZxCKotZO82cvDOdAfHW`,
                    }).then((results) => {
                        const data = results.data
                        if (typeof data.type === 'string') {
                            console.error(data.message)
                            if (data.type === 'silent') return
                            alert(data.message)
                        } else {
                            console.log(data)
                        }
                    }).catch((error) => {
                        alert('Unhandled exception')
                    })
                }}
            />
            <Button
                title='Leave a channel'
                onPress={() => {
                    callFirebaseFunction('leaveGroup', {
                        groupId: `gZxCKotZO82cvDOdAfHW`,
                    }).then((results) => {
                        const data = results.data
                        if (typeof data.type === 'string') {
                            console.error(data.message)
                            if (data.type === 'silent') return
                            alert(data.message)
                        } else {
                            console.log(data)
                        }
                    }).catch((error) => {
                        alert('Unhandled exception')
                    })
                }}
            />
            <Button
                title='Get Notifications'
                onPress={() => {
                    callFirebaseFunction('getNotifications', {}).then((results) => {
                        const data = results.data
                        if (typeof data.type === 'string') {
                            console.error(data.message)
                            if (data.type === 'silent') return
                            alert(data.message)
                        } else {
                            console.log(data)
                        }
                    }).catch((error) => {
                        alert('Unhandled exception')
                    })
                }}
            />
            <Button
                title='Delete the Playground Screen'
                onPress={() => {
                    if (screensManager) {
                        screensManager('remove', 7)
                    }
                }}
            />
        </Screen>
    )
}
