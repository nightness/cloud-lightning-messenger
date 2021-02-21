import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    Screen,
    Container,
    TextInput,
    Button,
    FirestoreCollectionView
} from '../themed/Components'
import { Styles } from '../shared/Constants'
import { FirebaseContext } from '../firebase/FirebaseContext'
import Message from './Message'
import { createMessage, useMessenger } from './MessengerReducer'

export default ({ navigation }) => {
    const { currentUser, claims } = useContext(FirebaseContext)
    const [messageText, setMessageText] = useState('')
    const [messenger, messengerDispatch] = useMessenger(currentUser.uid, 25)

    useEffect(() => {
        console.log(claims)
    }, [claims])

    const sendMessage = () => {
        const text = messageText
        setMessageText('')
        createMessage(text)
            .then(results => {
                const data = results.data;
                if (typeof (data.type) === 'string') {
                    console.log("Error: " + data.message)
                    if (data.type === 'silent') return
                    alert(data.message)
                } else {
                    console.log(data)
                }
            })
            .catch(error => {
                alert('Unhandled exception')
            })
    }

    const onMessageKeyPress = ({ key }) => {
        if (key != 'Enter') return
        // Adds a new message to the chatroom
        sendMessage()
    }

    return (
        <Screen navigation={navigation} title={"Wall"}>
            <Container>
                <FirestoreCollectionView
                    contentContainerStyle={Styles.messenger.flatList}
                    collectionPath={messenger.messageCollectionPath}
                    autoScrollToEnd={true}
                    orderBy='postedAt'
                    renderItem={({ item }) => <Message item={item} />}
                />
                <View style={Styles.messenger.views}>
                    <TextInput
                        value={messageText}
                        style={Styles.messenger.textInput}
                        onChangeText={msg => setMessageText(msg)}
                        onKeyPress={onMessageKeyPress}
                    />
                    <Button
                        title='Send'
                        style={Styles.messenger.sendButton}
                        disabled={messageText.length < 1}
                        onPress={sendMessage}
                    />
                </View>
            </Container>
        </Screen>
    )
}
