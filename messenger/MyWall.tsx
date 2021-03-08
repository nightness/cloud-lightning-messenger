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
import { createMessage } from '../firebase/Firebase'
import { StackNavigationProp } from '@react-navigation/stack'
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const { currentUser } = useContext(FirebaseContext)
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
        createMessage('/walls', currentUser.uid, text)
            .then((results) => {
                const data = results.data
                if (typeof data.type === 'string') {
                    console.error(data.message)
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
                <View style={Styles.messenger.views}>
                    <TextInput
                        classRef={textInput}
                        value={messageText}
                        saveHistory={true}
                        style={Styles.messenger.textInput}
                        onChangeText={(msg) => setMessageText(msg)}
                        onSubmit={sendMessage}
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
