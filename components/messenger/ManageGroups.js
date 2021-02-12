import React, { useState, useContext, useEffect, useRef } from 'react'
import { FlatList } from 'react-native'
import { Text, Modal, TextInput, View, Button, Container, Screen, Picker, ActivityIndicator, DisplayError } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import { useCollection, getFirestore } from '../firebase/Firebase'

export default ({ navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/groups')
    const [groups, setGroups] = useState([])
    const [groupName, setGroupName] = useState('')
    const [addGroupModalVisible, setAddGroupModalVisible] = useState(false)
    const [renameGroupModalVisible, setRenameGroupModalVisible] = useState(false)
    const [removeGroupModalVisible, setRemoveGroupModalVisible] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState()
    const pickerRef = useRef()

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
        if (!selectedGroup)
            setSelectedGroup(groups[0])
    }, [groups])

    useEffect(() => {
        console.log(selectedGroup)
    }, [selectedGroup])

    const addGroup = () => {
        getFirestore()
            .collection('/groups')
            .add({
                name: groupName
            }).then(() => setGroupName(''))
            .catch(error => {
                if (error.code === 'permission-denied')
                    alert('Permission Denied')
            })
    }

    const renameGroup = () => {
        getFirestore()
            .collection('/groups')
            .doc(selectedGroup.value)
            .update({
                name: groupName
            }).then(() => {
                setGroupName('')
                selectedGroup.label = groupName
            })
            .catch(error => {
                if (error.code === 'permission-denied')
                    alert('Permission Denied')
            })
    }

    const removeSelectedGroup = () => {
        getFirestore()
            .collection('/groups')
            .doc(selectedGroup.value)
            .delete()
            .catch(error => {
                if (error.code === 'permission-denied')
                    alert('Permission Denied')
            })
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
                visible={removeGroupModalVisible}
                onTouchOutside={() => setRemoveGroupModalVisible(false)}
            >
                <Text style={Styles.logoutModal.text}>
                    Are you sure you want to remove the '{selectedGroup && selectedGroup.label}' group?
                </Text>
                <View style={Styles.logoutModal.buttonView}>
                    <Button
                        style={Styles.logoutModal.button}
                        title='Yes'
                        onPress={() => setRemoveGroupModalVisible(false) || removeSelectedGroup()}
                    />
                    <Button
                        style={Styles.logoutModal.button}
                        title='No'
                        onPress={() => setRemoveGroupModalVisible(false)}
                    />
                </View>
            </Modal>
            <Modal
                visible={addGroupModalVisible}
                onTouchOutside={() => setAddGroupModalVisible(false)}
            >
                <TextInput
                    style={Styles.logoutModal.text}
                    placeholder='Group Name'
                    onChangeText={text => setGroupName(text)}
                />

                <View style={Styles.logoutModal.buttonView}>
                    <Button
                        style={Styles.logoutModal.button}
                        title='Add Group'
                        onPress={() => setAddGroupModalVisible(false) || addGroup()}
                    />
                    <Button
                        style={Styles.logoutModal.button}
                        title='Cancel'
                        onPress={() => setAddGroupModalVisible(false) || setGroupName('')}
                    />
                </View>
            </Modal>
            <Modal
                visible={renameGroupModalVisible}
                onTouchOutside={() => setRenameGroupModalVisible(false)}
            >
                <TextInput
                    style={Styles.logoutModal.text}
                    placeholder='Group Name'
                    defaultValue={selectedGroup && selectedGroup.label}
                    onChangeText={text => setGroupName(text)}
                />

                <View style={Styles.logoutModal.buttonView}>
                    <Button
                        style={Styles.logoutModal.button}
                        title='Rename Group'
                        onPress={() => setRenameGroupModalVisible(false) || renameGroup()}
                    />
                    <Button
                        style={Styles.logoutModal.button}
                        title='Cancel'
                        onPress={() => setRenameGroupModalVisible(false) || setGroupName('')}
                    />
                </View>
            </Modal>
            <Picker
                data={groups}
                onValueChanged={newValue => {
                    setSelectedGroup(newValue)
                }}
                classRef={pickerRef}
            />
            <View style={Styles.views.flexRowJustifyCenter}>
                <Button
                    title='Add'
                    onPress={() => setAddGroupModalVisible(true)}
                />
                <Button
                    title='Rename'
                    disabled={!selectedGroup}
                    onPress={() => setGroupName(selectedGroup && selectedGroup.label) || setRenameGroupModalVisible(true)}
                />
                <Button
                    title='Remove'
                    disabled={!selectedGroup}
                    onPress={() => setRemoveGroupModalVisible(true)}
                />
            </View>
        </>
    }

    return (
        <Screen navigation={navigation} title={"Manage Groups"}>
            <Container>
                {render}
            </Container>
        </Screen>
    )
}
