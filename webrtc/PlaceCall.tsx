import React, { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { WebView, WebViewRef } from '../components'
import Screen from '../components/Screen'

interface Props {
    navigation: StackNavigationProp<any, string>
}

export default ({ navigation }: Props) => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <Screen navigation={navigation} title="Video Chat">

        </Screen>
    )
}
