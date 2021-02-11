import React, { useState, useContext, useEffect, useRef } from 'react'
import { FlatList } from 'react-native'
import { Text, Modal, TextInput, View, Button, Container, Screen, Picker, ActivityIndicator, DisplayError } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import { useCollection, getFirestore } from '../firebase/Firebase'

export default ({ navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/districts')
    const [districts, setDistricts] = useState([])
    const [districtName, setDistrictName] = useState('')
    const [addDistrictModalVisible, setAddDistrictModalVisible] = useState(false)
    const [selectedDistrict, setSelectedDistrict] = useState()
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
            push(docRef).then(() => setDistricts(newState))
        })
    }, [snapshot])

    useEffect(() => {
        if (!selectedDistrict)
            setSelectedDistrict(districts[0])
    }, [districts])

    useEffect(() => {
        console.log(selectedDistrict)
    }, [selectedDistrict])

    const addDistrict = () => {
        getFirestore()
            .collection('/districts')
            .add({
                name: districtName
            }).catch(error => {
                if (error.code === 'permission-denied')
                    alert('Permission Denied')
            })
    }

    const removeSelectedDistrict = () => {
        getFirestore()
            .collection('/districts')
            .doc(selectedDistrict.value)
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
                visible={addDistrictModalVisible}
                onTouchOutside={() => setAddDistrictModalVisible(false)}
            >
                <TextInput
                    style={Styles.logoutModal.text}
                    placeholder='District Name'
                    onChangeText={text => setDistrictName(text)}
                />

                <View style={Styles.logoutModal.buttonView}>
                    <Button
                        style={Styles.logoutModal.button}
                        title='Add District'
                        onPress={() => setAddDistrictModalVisible(false) || addDistrict()}
                    />
                    <Button
                        style={Styles.logoutModal.button}
                        title='Cancel'
                        onPress={() => setAddDistrictModalVisible(false)}
                    />
                </View>
            </Modal>
            <Picker
                data={districts}
                onValueChanged={newValue => {
                    setSelectedDistrict(newValue)
                }}
                classRef={pickerRef}
            />
            <View style={Styles.views.flexRowJustifyCenter}>
                <Button
                    title='Add'
                    onPress={() => setAddDistrictModalVisible(true)}
                />
                <Button
                    title='Remove'
                    onPress={removeSelectedDistrict}
                />
            </View>
        </>
    }

    return (
        <Screen navigation={navigation} title={"Manage Districts"}>
            <Container>
                {render}
            </Container>
        </Screen>
    )
}
