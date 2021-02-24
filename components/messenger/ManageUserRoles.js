import React, { useState, useContext, useEffect, useRef } from 'react'
import { Text, Modal, TextInput, View, Button, Container, Screen, Picker, ActivityIndicator, DisplayError, LabeledSwitch } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { useCollection, getFirestore } from '../firebase/Firebase'

export default ({ navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const { currentUser, claims, addClaim, removeClaim, getClaims } = useContext(FirebaseContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('profiles')
    const [members, setMembers] = useState([])
    const [selectedMember, setSelectedMember] = useState()
    const [loadingClaims, setLoadingClaims] = useState(false)
    const [isAdmin, setIsAdmin] = useState()
    const [isManager, setIsManager] = useState()
    const [isModerator, setIsModerator] = useState()
    const [permissionDenied, setPermissionDenied] = useState(true)

    const setClaim = (uid, claimName, value) => {
        let promise = value ? addClaim(uid, claimName) : removeClaim(uid, claimName)
        promise.then(results => {
            console.log(results)
        })
    }
    const toggleAdmin = () => setIsAdmin(previousState => setClaim(selectedMember.value, 'admin', !previousState) || !previousState)
    const toggleManager = () => setIsManager(previousState => setClaim(selectedMember.value, 'manager', !previousState) || !previousState)
    const toggleModerator = () => setIsModerator(previousState => setClaim(selectedMember.value, 'moderator', !previousState) || !previousState)

    useEffect(() => {
        setPermissionDenied(!claims.admin)
    }, [])

    // Update the 'users' state
    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        var newState = []
        snapshot.docs.forEach(docRef => {
            const push = async docRef => {
                const name = await docRef.get('displayName')
                newState.push({
                    label: name || `{${docRef.id}}`,
                    value: docRef.id
                })
            }
            push(docRef)
                .then(() => setMembers(newState))
                .catch(err => console.error(err))
        })
    }, [snapshot])

    useEffect(() => {
        if (!selectedMember)
            setSelectedMember(members[0])
    }, [members])

    useEffect(() => {
        if (!selectedMember) {
            setIsAdmin(false)
            setIsManager(false)
            setIsModerator(false)
            return
        }
        setLoadingClaims(true)
        getClaims(selectedMember.value)
            .then(claims => {
                setIsAdmin(claims && !!claims.admin)
                setIsManager(claims && !!claims.manager)
                setIsModerator(claims && !!claims.moderator)
                setLoadingClaims(false)
            })
    }, [selectedMember])

    let render = <ActivityIndicator />
    if (errorCollection || (permissionDenied && !loadingCollection)) {
        render = <DisplayError
            permissionDenied={(errorCollection?.code === 'permission-denied' || permissionDenied)}
        />
    } else if (!loadingCollection) {
        render = <>
            <View>
                <Picker
                    data={members}
                    onValueChanged={newValue => {
                        setSelectedMember(newValue)
                    }}
                />
            </View>
            <View style={Styles.views.flexRowJustifyCenter}>
                <LabeledSwitch style={{ marginRight: 15 }} isLoading={loadingClaims} label='Admin' value={!!isAdmin} onChange={toggleAdmin} />
                <LabeledSwitch style={{ marginRight: 15 }} isLoading={loadingClaims} label='Manager' value={!!isManager} onChange={toggleManager} />
                <LabeledSwitch isLoading={loadingClaims} label='Moderator' value={!!isModerator} onChange={toggleModerator} />
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
