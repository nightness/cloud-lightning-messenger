import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    Screen,
    Container,
    Text,
    Picker,
    TextInput,
    Button,
    ActivityIndicator,
    DisplayError,
    FirestoreCollectionView
} from '../themed/Components'
import { Styles } from '../shared/Constants'
import { useCollection } from '../firebase/Firebase'
import { FirebaseContext } from '../firebase/FirebaseContext'
import Message from './Message'
import { createMessage, useMessenger } from './MessengerReducer'

export default ({ navigation }) => {
    const { currentUser, claims } = useContext(FirebaseContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/groups')
    const [groups, setGroups] = useState([])
    const [messageText, setMessageText] = useState('')
    const [messenger, messengerDispatch] = useMessenger(currentUser.uid, 25)

    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        var newState = []
        snapshot.docs.forEach(docRef => {
            const push = async docRef => {
                const name = await docRef.get('name')
                newState.push({
                    label: name,
                    value: docRef.id
                })
            }
            push(docRef).then(() => setGroups(newState))
        })
    }, [snapshot])

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

    const dataUsers = [
        { label: 'User 1', value: 'U1' },
        { label: 'User 2', value: 'U2' },
        { label: 'User 3', value: 'U3' },
        { label: 'User 4', value: 'U4' },
        { label: 'User 5', value: 'U5' }
    ]

    return (
        <Screen navigation={navigation} title={"Dispatch Messenger"}>
            <Container>
                <View style={Styles.messenger.views}>
                    <Picker
                        data={groups}
                        onValueChanged={newValue => {
                            console.log(newValue)
                        }}
                    />
                    <Picker
                        data={dataUsers}
                        selectedValue={'U5'}
                        onValueChanged={newValue => {
                            console.log(newValue)
                        }}
                    />
                </View>
                <FirestoreCollectionView
                    contentContainerStyle={Styles.messenger.flatlist}
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
