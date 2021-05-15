import React, { useState } from 'react'
import { Platform } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { WebView } from 'cloud-lightning-themed-ui'
import Screen from '../components/Screen'

interface Props {
    navigation: StackNavigationProp<any, string>
}

const html = require('./Room.html')

export default ({ navigation }: Props) => {
    return (
        <Screen navigation={navigation} title="Video Chat">
            <WebView
                style={{ flex: 1 }}
                originWhitelist={['*']}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                bounces={false}
                mediaPlaybackRequiresUserAction={false}
                source={{ html }}
            />
        </Screen>
    )
}
