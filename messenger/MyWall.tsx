import React, { useState, useContext, useEffect, useRef } from 'react'
import {
    View,
    Screen,
    Container,
    TextInput,
    Button,
    FirestoreCollectionView,
} from '../components/Components'
import { TextInput as NativeTextInput } from 'react-native'
import { Styles } from '../app/Styles'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { GlobalContext } from '../app/GlobalContext'
import Message from './Message'
import { callFirebaseFunction } from '../firebase/Firebase'
import { StackNavigationProp } from '@react-navigation/stack'
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GradientColors } from '../app/GradientColors'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const { currentUser } = useContext(FirebaseContext)
    const { theme } = useContext(GlobalContext)
    const [messageText, setMessageText] = useState('')
    const textInput = useRef<NativeTextInput>()
    const [messageCollectionPath, setMessageCollectionPath] = useState<string>('/public')

    useEffect(() => {
        if (currentUser)
            setMessageCollectionPath(`/walls/${currentUser.uid}/messages`)
    }, [currentUser])

    useEffect(() => {
        textInput.current?.focus()
    }, [textInput])

    const sendMessage = () => {
        if (!currentUser) return
        const text = messageText
        setMessageText('')
        callFirebaseFunction('setMessage', {
            collectionPath: `/walls`,
            documentId: currentUser.uid,
            message: text,
        }).then((results) => {
            const data = results.data
            if (typeof data.type === 'string') {
                console.error(data.message)
                if (data.type === 'silent') return
                alert(data.message)
            } else {
                console.log(data)
            }
            textInput.current?.focus()
        }).catch((error) => {
            alert('Unhandled exception')
        })
    }

    return (
        <Screen navigation={navigation} title={'My Wall'}>
            <Container>
                <FirestoreCollectionView<Message>
                    collectionPath={messageCollectionPath}
                    autoScrollToEnd={true}
                    orderBy="postedAt"
                    limitLength={25}
                    // @ts-ignore
                    renderItem={({ item }) => <Message item={item} />}
                />
                <LinearGradient
                    colors={GradientColors[theme].secondary}>
                    <View style={Styles.messenger.views}>
                        <TextInput
                            classRef={textInput}
                            value={messageText}
                            style={Styles.messenger.textInput}
                            onChangeText={(msg) => setMessageText(msg)}
                            underlineColorAndroid="transparent"
                        />
                        <Button
                            title="Send"
                            style={Styles.messenger.sendButton}
                            disabled={messageText.length < 1}
                            onPress={sendMessage}
                        />
                    </View>
                </LinearGradient>
            </Container>
        </Screen>
    )
}
