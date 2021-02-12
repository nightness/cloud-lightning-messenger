import React, { useState, useContext, useEffect, useRef } from 'react'
import { FlatList } from 'react-native'
import { Text, Modal, TextInput, View, Button, Container, Screen, Picker, ActivityIndicator, DisplayError } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import { useCollection, getFirestore } from '../firebase/Firebase'

export default ({ navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/users')
    const [users, setUsers] = useState([])
    const pickerRef = useRef()
    // Modal states
    const [roleName, setRoleName] = useState('')
    const [addRoleModalVisible, setAddRoleModalVisible] = useState(false)
    const [removeRoleModalVisible, setRemoveRoleModalVisible] = useState(false)
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

    const addRole = () => {

    }

    const removeSelectedRole = () => {

    }

    let render = <ActivityIndicator />
    if (errorCollection) {
        let errorCollectionCode = errorCollection ? errorCollection.code : null
        render =
            <DisplayError
                permissionDenied={(errorCollectionCode === 'permission-denied')}
            />
    } else if (!loadingCollection) {
        render = <>
            <Modal
                visible={removeRoleModalVisible}
                onTouchOutside={() => setRemoveRoleModalVisible(false)}
            >
                <Text style={Styles.logoutModal.text}>
                    Are you sure you want to remove the '{selectedUser && selectedUser.label}' role from this user?
                </Text>
                <View style={Styles.logoutModal.buttonView}>
                    <Button
                        style={Styles.logoutModal.button}
                        title='Yes'
                        onPress={() => setRemoveRoleModalVisible(false) || removeSelectedRole()}
                    />
                    <Button
                        style={Styles.logoutModal.button}
                        title='No'
                        onPress={() => setRemoveRoleModalVisible(false)}
                    />
                </View>
            </Modal>
            <Modal
                visible={addRoleModalVisible}
                onTouchOutside={() => setAddRoleModalVisible(false)}
            >
                <TextInput
                    style={Styles.logoutModal.text}
                    placeholder='Role Name'
                    onChangeText={text => setRoleName(text)}
                />

                <View style={Styles.logoutModal.buttonView}>
                    <Button
                        style={Styles.logoutModal.button}
                        title='Add Role'
                        onPress={() => setAddRoleModalVisible(false) || addRole()}
                    />
                    <Button
                        style={Styles.logoutModal.button}
                        title='Cancel'
                        onPress={() => setAddRoleModalVisible(false) || setRoleName('')}
                    />
                </View>
            </Modal>
            <Picker
                data={users}
                onValueChanged={newValue => {
                    setSelectedUser(newValue)
                }}
                classRef={pickerRef}
            />
            <View style={Styles.views.flexRowJustifyCenter}>
                <Button
                    title='Add'
                    onPress={() => setAddRoleModalVisible(true)}
                />
                <Button
                    title='Remove'
                    disabled={!selectedUser}
                    onPress={() => setRemoveRoleModalVisible(true)}
                />
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
