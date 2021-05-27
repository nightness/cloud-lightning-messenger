import React, { useEffect, useContext, useState } from 'react'
import { DefaultRouterOptions } from '@react-navigation/native'
import Screen from '../components/Screen'
import { Button } from '../components'
import { DrawerContext } from '../navigation'
import { callFirebaseFunction } from '../database/Firebase'

interface Props {
    navigation: DefaultRouterOptions
}

// Playground
export const Playground = ({ navigation }: Props) => {
    const { setBadge, ScreenManager, screenIndex } = useContext(DrawerContext)
    return (
        <Screen navigation={navigation} title="Playground">
            <Button
                title='Join a channel'
                onPress={() => {
                    callFirebaseFunction('joinGroup', {
                        groupId: `gZxCKotZO82cvDOdAfHW`,
                    })
                        .then((results) => {
                            const data = results.data
                            if (typeof data.type === 'string') {
                                console.error(data.message)
                                if (data.type === 'silent') return
                                alert(data.message)
                            } else {
                                console.log(data)
                            }
                        })
                        .catch((err) => console.warn(err))
                }}
            />
            <Button
                title='Leave a channel'
                onPress={() => {
                    callFirebaseFunction('leaveGroup', { groupId: `gZxCKotZO82cvDOdAfHW`, })
                        .then((results) => {
                            const data = results.data
                            if (typeof data.type === 'string') {
                                console.error(data.message)
                                if (data.type === 'silent') return
                                alert(data.message)
                            } else {
                                console.log(data)
                            }
                        })
                        .catch((err) => console.warn(err))
                }}
            />
            <Button
                title='Get Notifications'
                onPress={() => {
                    callFirebaseFunction('getNotifications', {})
                        .then((results) => {
                            const data = results.data
                            if (typeof data.type === 'string') {
                                console.error(data.message)
                                if (data.type === 'silent') return
                                alert(data.message)
                            } else {
                                console.log(data)
                            }
                        })
                        .catch((err) => console.warn(err))
                }}
            />
            <Button
                title='Delete the Playground Screen'
                onPress={() => {
                    if (ScreenManager?.removeScreen && screenIndex) {
                        ScreenManager.removeScreen(screenIndex)
                    }
                }}
            />
            <Button
                title='Toast Test'
                onPress={() => {

                }}
            />
        </Screen>
    )
}
