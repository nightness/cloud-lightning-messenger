import React, { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
// @ts-ignore
import { WebView as WebViewWeb } from 'react-native-web-webview'
import { WebView, WebViewProps } from 'react-native-webview'

export interface WebViewRef {
    goBack: () => void
    goForward: () => void
    reload: () => void
    stopLoading(): void
    extraNativeComponentConfig: () => any
    injectJavaScript: (script: string) => void
    requestFocus: () => void
    postMessage: (message: string) => void
}

export interface ExtendedWebViewProps extends WebViewProps {
    classRef?: React.LegacyRef<WebViewRef>
}

export default ({ classRef, ...restProps }: ExtendedWebViewProps) => {
    useEffect(() => {
        console.log(classRef)
    })

    if (Platform.OS === 'web')
        return (
            <WebViewWeb ref={classRef} {...restProps} />
        )
    return (
        // @ts-ignore
        <WebView ref={classRef} {...restProps} />
    )
}
