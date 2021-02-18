import React, { useState, useContext, useEffect, useRef } from 'react'
import { Text, Modal, TextInput, View, Button, Container, Screen, Picker, ActivityIndicator, DisplayError, LabeledSwitch } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import { useCollection, getFirestore } from '../firebase/Firebase'

export default ({ navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('profiles')
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState()
    const [isAdmin, setIsAdmin] = useState()
    const [isManager, setIsManager] = useState()
    const [isModerator, setIsModerator] = useState()

    const toggleAdmin = () => setIsAdmin(previousState => !previousState)
    const toggleManager = () => setIsManager(previousState => !previousState)
    const toggleModerator = () => setIsModerator(previousState => !previousState)

    useEffect(() => {
        if (isAdmin !== undefined || isManager !== undefined || isModerator !== undefined)
            console.log(`isAdmin = ${!!isAdmin}, isManager = ${!!isManager}, isModerator = ${!!isModerator}`)
    }, [isAdmin, isManager, isModerator])

    // Update the 'users' state
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
            <View>
                <Picker
                    data={users}
                    onValueChanged={newValue => {
                        setSelectedUser(newValue)
                    }}
                />
            </View>
            <View style={Styles.views.flexRowJustifyCenter}>
                <LabeledSwitch style={{ marginRight: 15 }} label='Admin' onChange={toggleAdmin} />
                <LabeledSwitch style={{ marginRight: 15 }} label='Manager' onChange={toggleManager} />
                <LabeledSwitch label='Moderator' onChange={toggleModerator} />
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
