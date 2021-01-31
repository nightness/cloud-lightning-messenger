import React, { useState, useContext, useEffect, useReducer } from 'react'
import { View } from 'react-native'
import { Screen, Container, Text, TextInput, Button, ActivityIndicator, DisplayError, FirestoreCollectionView } from '../common/Components'
import { Styles } from '../shared/Constants'
import { FirebaseProvider, FirebaseContext, callFirebaseFunction } from '../firebase/FirebaseContext'
import Message from './Message'

export const createMessage = (messageText) =>
    callFirebaseFunction('addMessage', {
        message: messageText,
    })


const createMessenger = (messengerContainerId, viewLengthMinimum) => {
    const result = {}
    result.messengerContainerId = messengerContainerId
    result.messageCollectionPath = "/messenger/" + messengerContainerId + "/messages/"
    result.messengerDocumentPath = "/messenger/" + messengerContainerId
    result.viewLength = viewLengthMinimum
    return result
}

export const useMessenger = (groupContainerId, viewLengthMinimum) =>
    useReducer(reducer, createMessenger(groupContainerId, viewLengthMinimum))

function reducer(state, action) {
    switch (action.type) {
        case "setView": {
            const newState = { ...state }
            newState.viewLength = action.length ? action.length : newState.viewLength
            newState.viewFirst = action.first ? action.first : newState.viewFirst
            newState.viewLast = action.last ? action.last : newState.viewLast
            return newState
        }
        case 'incrementViewLength': {
            const newState = { ...state }
            newState.viewLength = newState.viewLength + (action.amount ? action.amount : 1)
            console.log(`incrementViewLength: new length = ${newState.viewLength}`)
            return newState
        }
        default:
            return state
    }
}

const Messenger = ({ navigation }) => {
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
        <Screen navigation={navigation} title={"Messenger"} hasBurger={true} hasLogout={true}>
            <Container>
                <FirestoreCollectionView
                    contentContainerStyle={Styles.messenger.flatlist}
                    collectionPath={messenger.messageCollectionPath}
                    autoScrollToEnd={true}
                    orderBy='postedAt'
                    renderItem={({ item }) => <Message item={item} />}
                />
                <View style={Styles.messenger.viewTextInput}>
                    <View style={Styles.messenger.commentInput}>
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
                </View>
            </Container>
        </Screen>
    )
}

export default ({ navigation }) =>
    <FirebaseProvider>
        <Messenger navigation={navigation} />
    </FirebaseProvider>