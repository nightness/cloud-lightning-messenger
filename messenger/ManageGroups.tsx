import React, { useState, useContext, useEffect, useRef } from 'react'
import {
    ScrollView,
    Text,
    Modal,
    TextInput,
    View,
    Button,
    Container,
    Screen,
    Picker,
    ActivityIndicator,
    DisplayError,
    PickerItem,
} from '../components/Components'
import { Styles } from '../shared/Styles'
import { GlobalContext } from '../shared/GlobalContext'
import { useCollection, getFirestore } from '../firebase/Firebase'
import { ProfileContext } from '../shared/ProfileContext'
//import { ScrollView } from 'react-native-gesture-handler'

interface Props {
    navigation: object
}

export default ({ navigation, ...restProps }: Props) => {
    const { theme } = useContext(GlobalContext)
    const profileContext = useContext(ProfileContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/groups')
    const [groups, setGroups] = useState([])
    const [groupName, setGroupName] = useState('')
    const [selectedGroup, setSelectedGroup] = useState<PickerItem>()
    const [members, setMembers] = useState([])
    const [memberName, setMemberName] = useState('')
    const [selectedMember, setSelectedMember] = useState<PickerItem>()
    const [addGroupModalVisible, setAddGroupModalVisible] = useState(false)
    const [renameGroupModalVisible, setRenameGroupModalVisible] = useState(false)
    const [removeGroupModalVisible, setRemoveGroupModalVisible] = useState(false)

    const [addMemberModalVisible, setAddMemberModalVisible] = useState(false)
    const [removeMemberModalVisible, setRemoveMemberModalVisible] = useState(false)

    const renameGroup = () => {
        if (!selectedGroup) return
        getFirestore()
            .collection('/groups')
            .doc(selectedGroup.value)
            .update({
                name: groupName,
            })
            .then(() => {
                setGroupName('')
                selectedGroup.label = groupName
            })
            .catch((error) => {
                if (error.code === 'permission-denied') alert('Permission Denied')
            })
    }

    const removeSelectedGroup = () => {
        if (!selectedGroup) return
        getFirestore()
            .collection('/groups')
            .doc(selectedGroup.value)
            .delete()
            .catch((error) => {
                if (error.code === 'permission-denied') alert('Permission Denied')
            })
    }

    const loadGroupMembers = async () => {
        if (!selectedGroup || !selectedGroup.value) return
        const snapshot = await getFirestore()
            .collection('groups')
            .doc(selectedGroup.value)
            .get()
        const data = snapshot.data()
        let promises: Promise<any>[] = []
        let groupMembers: PickerItem[] = []
        if (data && data.members) {
            const add = async (uid: string) => {
                const profile = await profileContext.getUserProfile(uid)
                groupMembers.push({
                    label: profile.displayName || `{${uid}}`,
                    value: uid,
                })
            }
            data.members.forEach((member) => {
                promises.push(add(member))
            })
        }
        Promise.all(promises).then(() => {
            setMembers(groupMembers)
            setSelectedMember(groupMembers.length > 0 ? groupMembers[0] : '')
        }) //.catch(() => undefined)
    }

    const addGroup = () => {
        getFirestore()
            .collection('/groups')
            .add({
                name: groupName,
            })
            .then(() => setGroupName(''))
            .catch((error) => {
                if (error.code === 'permission-denied') alert('Permission Denied')
            })
    }

    const addMember = () => {
        const newMembers = [...members, memberName]
        getFirestore()
            .collection('groups')
            .doc(selectedGroup.value)
            .set({
                name: selectedGroup.label,
                members: newMembers,
            })
            .then(() => {
                setMembers(newMembers)
            })
            .catch((error) => {
                if (error.code === 'permission-denied') alert('Permission Denied')
            })
    }

    const removeSelectedMember = () => {
        const newMembers = members.filter((obj) => obj.value != selectedMember.value)
        getFirestore()
            .collection('groups')
            .doc(selectedGroup.value)
            .set({
                name: selectedGroup.label,
                members: newMembers,
            })
            .then(() => {
                setMembers(newMembers)
            })
            .catch((error) => {
                if (error.code === 'permission-denied') alert('Permission Denied')
            })
    }

    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return

        var newState = []
        snapshot.docs.forEach((docRef) => {
            const push = async (docRef) => {
                const name = await docRef.get('name')
                newState.push({
                    label: name,
                    value: docRef.id,
                })
            }
            push(docRef).then(() => {
                setGroups(newState)
                setSelectedGroup(newState[0])
            }) // .catch(() => undefined)
        })
    }, [snapshot])

    useEffect(() => {
        if (!selectedGroup) setSelectedGroup(groups[0])
    }, [groups])

    useEffect(() => {
        if (selectedGroup) loadGroupMembers()
    }, [selectedGroup])

    useEffect(() => {
        if (selectedMember) console.log(selectedMember)
    }, [selectedMember])

    let render = <ActivityIndicator />
    if (errorCollection) {
        render = (
            <DisplayError
                permissionDenied={errorCollection?.code === 'permission-denied'}
            />
        )
    } else if (!loadingCollection) {
        render = (
            <>
                <Modal
                    visible={removeMemberModalVisible}
                    onTouchOutside={() => setRemoveGroupModalVisible(false)}
                >
                    <Text style={Styles.logoutModal.text}>
                        {`Are you sure you want to remove the '
                        ${{selectedMember?.label}}' from the '
                        ${{selectedGroup && selectedGroup.label}}' group?`}
                    </Text>
                    <View style={Styles.logoutModal.buttonView}>
                        <Button
                            style={Styles.logoutModal.button}
                            title="Yes"
                            onPress={() =>
                                setRemoveMemberModalVisible(false) ||
                                removeSelectedMember()
                            }
                        />
                        <Button
                            style={Styles.logoutModal.button}
                            title="No"
                            onPress={() => setRemoveMemberModalVisible(false)}
                        />
                    </View>
                </Modal>
                <Modal
                    visible={addMemberModalVisible}
                    onTouchOutside={() => setAddMemberModalVisible(false)}
                >
                    <TextInput
                        style={Styles.logoutModal.text}
                        placeholder="Member's UID"
                        onChangeText={(text) => setMemberName(text)}
                    />

                    <View style={Styles.logoutModal.buttonView}>
                        <Button
                            style={Styles.logoutModal.button}
                            title="Add Member"
                            onPress={() => setAddMemberModalVisible(false) || addMember()}
                        />
                        <Button
                            style={Styles.logoutModal.button}
                            title="Cancel"
                            onPress={() =>
                                setAddMemberModalVisible(false) || setMemberName('')
                            }
                        />
                    </View>
                </Modal>
                <Modal
                    visible={removeGroupModalVisible}
                    onTouchOutside={() => setRemoveGroupModalVisible(false)}
                >
                    <Text style={Styles.logoutModal.text}>
                        Are you sure you want to remove the '
                        {selectedGroup && selectedGroup.label}' group?
                    </Text>
                    <View style={Styles.logoutModal.buttonView}>
                        <Button
                            style={Styles.logoutModal.button}
                            title="Yes"
                            onPress={() =>
                                setRemoveGroupModalVisible(false) || removeSelectedGroup()
                            }
                        />
                        <Button
                            style={Styles.logoutModal.button}
                            title="No"
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
                        placeholder="Group Name"
                        onChangeText={(text) => setGroupName(text)}
                    />

                    <View style={Styles.logoutModal.buttonView}>
                        <Button
                            style={Styles.logoutModal.button}
                            title="Add Group"
                            onPress={() => setAddGroupModalVisible(false) || addGroup()}
                        />
                        <Button
                            style={Styles.logoutModal.button}
                            title="Cancel"
                            onPress={() =>
                                setAddGroupModalVisible(false) || setGroupName('')
                            }
                        />
                    </View>
                </Modal>
                <Modal
                    visible={renameGroupModalVisible}
                    onTouchOutside={() => setRenameGroupModalVisible(false)}
                >
                    <TextInput
                        style={Styles.logoutModal.text}
                        placeholder="Group Name"
                        defaultValue={selectedGroup && selectedGroup.label}
                        onChangeText={(text) => setGroupName(text)}
                    />

                    <View style={Styles.logoutModal.buttonView}>
                        <Button
                            style={Styles.logoutModal.button}
                            title="Rename Group"
                            onPress={() =>
                                setRenameGroupModalVisible(false) || renameGroup()
                            }
                        />
                        <Button
                            style={Styles.logoutModal.button}
                            title="Cancel"
                            onPress={() =>
                                setRenameGroupModalVisible(false) || setGroupName('')
                            }
                        />
                    </View>
                </Modal>
                <View>
                    <Text>Groups</Text>
                    <Picker
                        data={groups}
                        onValueChanged={(newValue) => setSelectedGroup(newValue)}
                    />
                    <View style={[Styles.views.flexRowJustifyCenter]}>
                        <Button
                            title="Add"
                            onPress={() => setAddGroupModalVisible(true)}
                        />
                        <Button
                            title="Rename"
                            disabled={!selectedGroup}
                            onPress={() =>
                                setGroupName(selectedGroup && selectedGroup.label) ||
                                setRenameGroupModalVisible(true)
                            }
                        />
                        <Button
                            title="Remove"
                            disabled={!selectedGroup}
                            onPress={() => setRemoveGroupModalVisible(true)}
                        />
                    </View>
                    <Text>Members</Text>
                    <Picker
                        data={members}
                        onValueChanged={(newValue) => setSelectedMember(newValue)}
                    />
                    <View style={Styles.views.flexRowJustifyCenter}>
                        <Button
                            title="Add"
                            onPress={() => setAddMemberModalVisible(true)}
                        />
                        <Button
                            title="Remove"
                            disabled={!selectedMember}
                            onPress={() => setRemoveMemberModalVisible(true)}
                        />
                    </View>
                </View>
            </>
        )
    }

    return (
        <Screen navigation={navigation} title={'Manage Groups'}>
            <Container>{render}</Container>
        </Screen>
    )
}
