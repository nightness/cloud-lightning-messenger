import React, { useState, useContext, useEffect, useRef } from 'react'
import { Text, Modal, TextInput, View, Button, Container, Screen, Picker, ActivityIndicator, DisplayError, LabeledSwitch } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import { useCollection, getFirestore } from '../firebase/Firebase'

export default ({ navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('profiles')
    const [users, setUsers] = useState([])
    const pickerRef = useRef()
    const [selectedUser, setSelectedUser] = useState()

    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        var newState = []
        snapshot.docs.forEach(docRef => {
            const push = async docRef => {
                const name = await docRef.get('displayName')
                newState.push({
                    label: name,
                    value: docRef.id
                })
            }
            push(docRef).then(() => setUsers(newState))
        })
    }, [snapshot])

    useEffect(() => {
        if (!selectedUser)
            setSelectedUser(users[0])
    }, [users])

    useEffect(() => {
        console.log(selectedUser)
    }, [selectedUser])

    let render = <ActivityIndicator />
    if (errorCollection) {
        let errorCollectionCode = errorCollection ? errorCollection.code : null
        render =
            <DisplayError
                permissionDenied={(errorCollectionCode === 'permission-denied')}
            />
    } else if (!loadingCollection) {
        render = <>
            <Picker
                data={users}
                onValueChanged={newValue => {
                    setSelectedUser(newValue)
                }}
                classRef={pickerRef}
            />
            <View style={{ flex: 5 }}>
                <LabeledSwitch label='Admin' onChange={value => console.log(value)} />
                <LabeledSwitch label='Moderator' onChange={value => console.log(value)} />
                <LabeledSwitch label='Speaker' onChange={value => console.log(value)} />
            </View>
        </>
    }

    return (
        <Screen navigation={navigation} title={"Manage User Roles"}>
            <Container>
                {render}
            </Container>
        </Screen>
    )
}
