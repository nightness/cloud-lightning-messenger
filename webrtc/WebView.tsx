import React, { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
// @ts-ignore
import { WebView as WebViewWeb } from 'react-native-web-webview'
import { WebView, WebViewProps } from 'react-native-webview'

interface Props extends WebViewProps {

}

export default ({ ...restProps }: Props) => {
    const webview = useRef<WebView>()

    useEffect(() => {
        console.log(webview)
    }, [webview])

    if (Platform.OS === 'web')
        return (
            <WebViewWeb {...restProps} />
        )
    return (
        // @ts-ignore
        <WebView ref={webview.current} {...restProps} />
    )
}
