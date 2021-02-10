import React, { useState, useContext, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Text, View, Button, Container, Screen, Picker, ActivityIndicator, DisplayError } from '../themed/Components'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'
import { useCollection } from '../firebase/Firebase'

// In-progress

export default ({ navigation, ...restProps }) => {
    const { theme } = useContext(GlobalContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/districts')
    const [districts, setDistricts] = useState([])

    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        var newState = []
        snapshot.docs.forEach(docRef => {
            newState.push({
                label: docRef.id,
                value: docRef.id
            })
        })
        setDistricts(newState)
    }, [snapshot])

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
                data={districts}
                //selectedValue={'D2'}
                onValueChanged={newValue => {
                    console.log(newValue)
                }}
            />
            <View style={Styles.views.flexRowJustifyCenter}>
                <Button
                    title='Add'
                />
                <Button
                    title='Remove'
                />
            </View>
        </>
    }

    return (
        <Screen navigation={navigation} title={"Manage Districts"} hasBurger={true} hasLogout={true}>
            <Container>
                {render}
            </Container>
        </Screen>
    )
}
