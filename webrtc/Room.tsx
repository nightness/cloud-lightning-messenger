import React, { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { WebView, WebViewRef } from '../components'
import Screen from '../components/Screen'

interface Props {
    navigation: StackNavigationProp<any, string>
}

const html = require('./Room.html')

export default ({ navigation }: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [webView, setWebView] = useState<HTMLIFrameElement>()


    useEffect(() => {
        if (webView !== undefined) {
            setIsLoading(false)
            //console.log()
        }
    }, [webView])

    useEffect(() => {
        console.info(`WebView is${isLoading ? ' ' : ' not '}loading`)
    }, [isLoading])
    
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
                    // @ts-expect-error
                    setWebView(target)
                    
                }}
                // onNavigationStateChange={({ }) => {

                // }}
            />
        </Screen>
    )
}
