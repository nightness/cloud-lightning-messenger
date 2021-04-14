import React, { useEffect, useState } from 'react'
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
    registerGlobals,
    RTCPeerConnectionConfiguration
} from 'react-native-webrtc'

interface Props {
    navigation: DrawerNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const [localStream, setLocalStream] = useState<any>()
    const [remoteStream, setRemoteStream] = useState<any>()

    useEffect(() => {
        // Async
        (async () => {
            const configuration = {
                iceServers: [
                    { "url": "stun:stun.l.google.com:19302" }
                ]
            }
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

            //const remoteStream = new MediaStream(configuration)

            const pc = new RTCPeerConnection(configuration);            

            let isFront = true;
            mediaDevices.enumerateDevices().then(sourceInfos => {
                console.log(sourceInfos);
                let videoSourceId;
                for (let i = 0; i < sourceInfos.length; i++) {
                    const sourceInfo = sourceInfos[i];
                    if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                        videoSourceId = sourceInfo.deviceId;
                    }
                }
                mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        mandatory: {
                            minFrameRate: 10,
                            minHeight: 96,
                            minWidth: 128
                        },
                        optional: [
        
                        ],
                        facingMode: (isFront ? "user" : "environment"),
                    }
                })
                    .then(stream => {
                        console.log('Got stream!')
                        console.log(stream)
                    })
                    .catch(error => {
                        console.error(error)
                    });
            });

            // localStream.getTracks().forEach((track) => {
            //     pc.addTrack(track, localStream);
            // })

            pc.createOffer().then(desc => {
                pc.setLocalDescription(desc).then(() => {
                    console.log('Send pc.localDescription to peer')
                });
            });
        
            pc.onicecandidate = function (event) {
                console.log('send event.candidate to peer')
            };
        
            // also support setRemoteDescription, createAnswer, addIceCandidate, onnegotiationneeded, oniceconnectionstatechange, onsignalingstatechange, onaddstream
        

            // // Push tracks from local stream to peer connection
            // localStream.getTracks().forEach((track) => {
            //     pc.addTrack(track, localStream);
            // });
            pc.onaddstream = (event) => {
                event.stream.getTracks().forEach((track) => {
                  remoteStream.addTrack(track)
                });
              };

        })().then(() => {

        }).catch((error) => {

        })
    })

    return (
        <Screen navigation={navigation} title="Video Conference">
            {/* <RTCView streamURL={this.state.stream.toURL()}/> */}
        </Screen>
    )
}
