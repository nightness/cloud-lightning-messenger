import React, { useState, useContext, useEffect, useRef } from 'react'
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
import {
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    TextInput as NativeTextInput
} from 'react-native'
import { createMessage } from './MessengerReducer'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const { currentUser, claims } = useContext(FirebaseContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/groups')
    const [groups, setGroups] = useState<PickerItem[]>([])
    const [selectedGroup, setSelectedGroup] = useState<PickerItem>()
    const [messageText, setMessageText] = useState('')
    const [groupCollectionPath, setGroupCollectionPath] = useState<string>('/public')
    const textInput = useRef<NativeTextInput>()

    useEffect(() => {
        textInput.current?.focus()
    }, [textInput])


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

    useEffect(() => {
        if (selectedGroup && selectedGroup.value)
            setGroupCollectionPath(`/groups/${selectedGroup.value}/messages/`)
        console.log(selectedGroup)
    }, [selectedGroup])

    const sendMessage = () => {
        if (!selectedGroup) return
        const text = messageText
        setMessageText('')
        createMessage('/groups', selectedGroup.value, text)
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
                        onValueChanged={setSelectedGroup}
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
                        onChangeText={(msg) => setMessageText(msg)}
                        onKeyPress={onMessageKeyPress}
                        classRef={textInput}
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
