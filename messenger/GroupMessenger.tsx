import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    Screen,
    Container,
    Picker,
    PickerItem,
    TextInput,
    Button,
    FirestoreCollectionView,
} from '../components/Components'
import { Styles } from '../shared/Styles'
import { DocumentData, QuerySnapshot, useCollection } from '../firebase/Firebase'
import { FirebaseContext } from '../firebase/FirebaseContext'
import Message from './Message'
import { StackNavigationProp } from '@react-navigation/stack'
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const { currentUser, claims } = useContext(FirebaseContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/groups')
    const [groups, setGroups] = useState<PickerItem[]>([])
    const [messageText, setMessageText] = useState('')
    const [groupCollectionPath, setGroupCollectionPath] = useState<string>('')

    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        var newState: PickerItem[] = []
        const querySnapshot = snapshot as QuerySnapshot<DocumentData>
        // @ts-ignore
        querySnapshot.docs.forEach((docRef) => {
            const push = async (docRef: DocumentData) => {
                const name = await docRef.get('name')
                newState.push({
                    label: name,
                    value: docRef.id,
                })
            }
            push(docRef).then(() => setGroups(newState))
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
        <Screen navigation={navigation} title={'Group Messenger'}>
            <Container>
                <View style={Styles.messenger.views}>
                    <Picker
                        data={groups}
                        onValueChanged={(newValue) => {
                            console.log(newValue)
                        }}
                    />
                </View>
                <FirestoreCollectionView
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
