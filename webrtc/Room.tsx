import React, { useRef, useState } from 'react'
import { Platform } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import WebView from './WebView'
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
                onError={({ nativeEvent }) => {
                    console.error(`WebView Error: ${nativeEvent.description}`)                    
                }}
                onTouchStart={({ nativeEvent }) => {
                    console.info(`WebView onTouchStart: ${nativeEvent.target}`)
                }}
                onLoad={({ target }) => {
                    console.info(`WebView onTouchStart: ${target}`)
                }}
                // onNavigationStateChange={({ }) => {

                // }}
            />
        </Screen>
    )
}
