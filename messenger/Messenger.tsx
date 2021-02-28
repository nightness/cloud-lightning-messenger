import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    Screen,
    Container,
    Picker,
    TextInput,
    Button,
    FirestoreCollectionView,
} from '../components/Components'
import { Styles } from '../shared/Styles'
import { useCollection } from '../firebase/Firebase'
import { FirebaseContext } from '../firebase/FirebaseContext'
import Message from './Message'

export default ({ navigation }) => {
    const { currentUser, claims } = useContext(FirebaseContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/profiles')
    const [members, setMembers] = useState([])
    const [messageText, setMessageText] = useState('')
    const [groupCollectionPath, setGroupCollectionPath] = useState()

    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        var newState = []
        snapshot.docs.forEach((docRef) => {
            const push = async (docRef) => {
                const name = await docRef.get('displayName')
                newState.push({
                    label: name || `{${docRef.id}}`,
                    value: docRef.id,
                })
            }
            push(docRef)
                .then(() => setMembers(newState))
                .catch((err) => console.error(err))
        })
    }, [snapshot])

    useEffect(() => {
        console.log(claims)
    }, [claims])

    const sendMessage = () => {
        // const text = messageText
        // setMessageText('')
        // createMessage(text)
        //     .then(results => {
        //         const data = results.data;
        //         if (typeof (data.type) === 'string') {
        //             console.log("Error: " + data.message)
        //             if (data.type === 'silent') return
        //             alert(data.message)
        //         } else {
        //             console.log(data)
        //         }
        //     })
        //     .catch(error => {
        //         alert('Unhandled exception')
        //     })
    }

    const onMessageKeyPress = ({ key }) => {
        if (key != 'Enter') return
        // Adds a new message to the chatroom
        sendMessage()
    }

    return (
        <Screen navigation={navigation} title={'Messenger'}>
            <Container>
                <View style={Styles.messenger.views}>
                    <Picker
                        data={members}
                        onValueChanged={(newValue) => {
                            console.log(newValue)
                        }}
                    />
                </View>
                <FirestoreCollectionView
                    contentContainerStyle={Styles.messenger.flatList}
                    collectionPath={groupCollectionPath}
                    autoScrollToEnd={true}
                    orderBy="postedAt"
                    renderItem={({ item }) => <Message item={item} />}
                />
                <View style={Styles.messenger.views}>
                    <TextInput
                        value={messageText}
                        style={Styles.messenger.textInput}
                        onChangeText={(msg) => setMessageText(msg)}
                        onKeyPress={onMessageKeyPress}
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
