import React, { useState, useContext, useEffect, useRef } from 'react'
import { ScrollView, Text, Modal, TextInput, View, Button, Container, Screen, Picker, ActivityIndicator, DisplayError } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import { useCollection, getFirestore } from '../firebase/Firebase'
import { ProfileContext } from '../shared/ProfileContext'
//import { ScrollView } from 'react-native-gesture-handler'

export default ({ navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const profileContext = useContext(ProfileContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/groups')
    const [groups, setGroups] = useState([])
    const [groupName, setGroupName] = useState('')
    const [selectedGroup, setSelectedGroup] = useState()
    const [members, setMembers] = useState([])
    const [selectedMember, setSelectedMember] = useState()
    const [addGroupModalVisible, setAddGroupModalVisible] = useState(false)
    const [renameGroupModalVisible, setRenameGroupModalVisible] = useState(false)
    const [removeGroupModalVisible, setRemoveGroupModalVisible] = useState(false)
    const pickerRef = useRef()

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

    const loadGroupMembers = async () => {
        const snapshot = await getFirestore()
            .collection('groups')
            .doc(selectedGroup.value)
            .get()
        const data = snapshot.data()
        if (!data || !data.members) return
        let promises = []
        let members = []
        data.members.forEach(member => {
            const add = async uid => {
                const profile = await profileContext.getUserProfile(member)
                members.push({
                    label: profile.displayName,
                    value: member
                })
            }
            promises.push(add(member))
        });
        Promise.all(promises).then(() => {
            setMembers(members)
            setSelectedMember(members[0])
        })
    }

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
        if (selectedGroup)
            loadGroupMembers()
    }, [selectedGroup])

    useEffect(() => {
        if (selectedMember)
            console.log(selectedMember)
    }, [selectedMember])

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
            <View>
                <Picker
                    data={groups}
                    onValueChanged={newValue => setSelectedGroup(newValue)}
                />
                <Picker
                    data={members}
                    onValueChanged={newValue => setSelectedMember(newValue)}
                />
            </View>
            <View style={[Styles.views.flexRowJustifyCenter]}>
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
            <View style={Styles.views.flexRowJustifyCenter}>
                <Button
                    title='Add Member'
                />
                <Button
                    title='Remove Member'
                    disabled={!selectedMember}
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
