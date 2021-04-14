import React from 'react'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import Screen from '../components/Screen'
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
  } from 'react-native-webrtc'

interface Props {
    navigation: DrawerNavigationProp<any>
}

export default ({ navigation }: Props) => {
    return (
        <Screen navigation={navigation} title="Video Conference">

        </Screen>
    )
}
