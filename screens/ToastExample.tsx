import React, { useEffect, useContext, useState } from 'react'
import { DefaultRouterOptions } from '@react-navigation/native'
import Screen from '../components/Screen'
import Toast from '../components/Toast'
import { Button } from 'react-native'

interface Props {
    navigation: DefaultRouterOptions
}

// Playground
export const ToastExample = ({ navigation }: Props) => {
    return (
        <Screen navigation={navigation} title="Toast Example">
            <Button
                title="Add message"
                onPress={() => {

                }}
            />
        </Screen>
    )
}
