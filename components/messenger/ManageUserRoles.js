import React, { useState, useContext, useEffect, useRef } from 'react'
import { Text, Modal, TextInput, View, Button, Container, Screen, Picker, ActivityIndicator, DisplayError, LabeledSwitch } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { useCollection, getFirestore } from '../firebase/Firebase'

export default ({ navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const { currentUser, addClaim, removeClaim, getClaims } = useContext(FirebaseContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('profiles')
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState()
    const [selectedUserClaims, setSelectedUserClaims] = useState()
    const [isAdmin, setIsAdmin] = useState()
    const [isManager, setIsManager] = useState()
    const [isModerator, setIsModerator] = useState()

    const setClaim = (uid, claimName, value) => {
        let promise = value ? addClaim(uid, claimName) : removeClaim(uid, claimName)
        promise.then(results => {
            console.log(results)
        })
    }
    const toggleAdmin = () => setIsAdmin(previousState => setClaim(selectedUser.value, 'admin', !previousState) || !previousState)
    const toggleManager = () => setIsManager(previousState => setClaim(selectedUser.value, 'manager', !previousState) || !previousState)
    const toggleModerator = () => setIsModerator(previousState => setClaim(selectedUser.value, 'moderator', !previousState) || !previousState)

    useEffect(() => {
        if (isAdmin === undefined && isManager === undefined && isModerator === undefined) return
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
            push(docRef)
                .then(() => setUsers(newState))
            // .catch(() => undefined)
        })
    }, [snapshot])

    useEffect(() => {
        if (!selectedUser)
            setSelectedUser(users[0])
    }, [users])

    useEffect(() => {
        if (!selectedUser) {
            setSelectedUserClaims({})
            setIsAdmin(false)
            setIsManager(false)
            setIsModerator(false)
            return
        }
        getClaims(selectedUser.value)
            .then(claims => {
                setSelectedUserClaims(claims)
                setIsAdmin(claims && !!claims.admin)
                setIsManager(claims && !!claims.manager)
                setIsModerator(claims && !!claims.moderator)
            })
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
                <LabeledSwitch style={{ marginRight: 15 }} label='Admin' value={!!isAdmin} onChange={toggleAdmin} />
                <LabeledSwitch style={{ marginRight: 15 }} label='Manager' value={!!isManager} onChange={toggleManager} />
                <LabeledSwitch label='Moderator' value={!!isModerator} onChange={toggleModerator} />
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
