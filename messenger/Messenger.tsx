import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    Screen,
    Container,
    Picker,
    TextInput,
    Button,
    FirestoreCollectionView,
    PickerItem,
} from '../components/Components'
import { Styles } from '../shared/Styles'
import { DocumentData, QuerySnapshot, useCollection } from '../firebase/Firebase'
import { FirebaseContext } from '../firebase/FirebaseContext'
import Message from './Message'
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const { currentUser, claims } = useContext(FirebaseContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/profiles')
    const [members, setMembers] = useState<PickerItem[]>([])
    const [messageText, setMessageText] = useState<string>('')
    const [groupCollectionPath, setGroupCollectionPath] = useState<string>('')

    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        var newState: PickerItem[] = []
        const querySnapshot = snapshot as QuerySnapshot<DocumentData>
        querySnapshot.docs.forEach((docRef) => {
            const push = async (docRef: DocumentData) => {
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

    const onMessageKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key != 'Enter') return
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
                <FirestoreCollectionView<Message>
                    collectionPath={groupCollectionPath}
                    autoScrollToEnd={true}
                    orderBy="postedAt"
                    // @ts-ignore
                    renderItem={({ item }) => <Message item={item} />}
                />
                <View style={Styles.messenger.views}>
                    <TextInput
                        value={messageText}
                        style={Styles.messenger.textInput}
                        onChangeText={(msg: string) => setMessageText(msg)}
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
