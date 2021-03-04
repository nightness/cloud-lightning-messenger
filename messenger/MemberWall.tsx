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
import { Styles } from '../shared/Styles'
import { FirebaseContext } from '../firebase/FirebaseContext'
import Message from './Message'
import { createMessage, useMessenger } from './MessengerReducer'
import { StackNavigationProp } from '@react-navigation/stack'
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const { currentUser } = useContext(FirebaseContext)
    const [messageText, setMessageText] = useState('')
    const [messenger, messengerDispatch] = useMessenger(currentUser?.uid || '', 25)
    const textInput = useRef<NativeTextInput>()

    useEffect(() => {
        textInput.current?.focus()
    }, [textInput])

    const sendMessage = () => {
        const text = messageText
        console.log(`sendMessage ${text}`)
        setMessageText('')
        createMessage(text)
            .then((results) => {
                const data = results.data
                if (typeof data.type === 'string') {
                    console.log('Error: ' + data.message)
                    if (data.type === 'silent') return
                    alert(data.message)
                } else {
                    console.log(data)
                }
                textInput.current?.focus()
            })
            .catch((error) => {
                alert('Unhandled exception')
            })
    }

    const onSubmit = (text: string) => {
        console.log(`onSubmit: ${text}`)
        sendMessage()
    }

    return (
        <Screen navigation={navigation} title={'Wall'}>
            <Container>
                <FirestoreCollectionView<Message>
                    collectionPath={messenger.messageCollectionPath}
                    autoScrollToEnd={true}
                    orderBy="postedAt"
                    // @ts-ignore
                    renderItem={({ item }) => <Message item={item} />}
                />
                <View style={Styles.messenger.views}>
                    <TextInput
                        classRef={textInput}
                        value={messageText}
                        saveHistory={true}
                        style={Styles.messenger.textInput}
                        onChangeText={(msg) => setMessageText(msg)}
                        onSubmit={onSubmit}
                        underlineColorAndroid="transparent"
                    />
                    <Button
                        title="Send"
                        style={Styles.messenger.sendButton}
                        disabled={messageText.length < 1}
                        onPress={sendMessage}
                    />
                </View>
            </Container>
        </Screen>
    )
}
