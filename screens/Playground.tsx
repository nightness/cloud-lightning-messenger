import React, { useEffect, useContext, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
    NavigationContainer,
    DarkTheme,
    DefaultTheme,
    DefaultRouterOptions,
} from '@react-navigation/native'
import Authentication from './Authentication'
import {
    ActivityIndicator,
    DisplayError,
    Screen,
    Text,
    Button,
    TextInput,
    View,
    Picker,
} from '../components/Components'
import { useAuthState } from '../firebase/Firebase'
import { FirebaseContext } from '../firebase/FirebaseContext'
import '../app/FormValidation'
import { Theme } from '../app/Themes'

interface Props {
    navigation: DefaultRouterOptions
}

// Playground
export const Playground = ({ navigation }: Props) => {
    const { currentUser, claims, addClaim, removeClaim } = useContext(FirebaseContext)
    const [claimName, setClaimName] = useState()
    const [data, setData] = useState([])

    /*
    useEffect(() => {
        setTimeout(() => {
            setData([
                { label: 'First', value: 1 },
                { label: 'Second', value: 2 },
                { label: 'Third', value: 3 },
            ])
        }, 1000)
    }, [])

    useEffect(() => {
        if (!currentUser) return
        //console.log(currentUser)
    }, [currentUser])

    return (
        <Screen navigation={navigation} title="Playground">
            <View>
                <Picker
                    data={data}
                    onValueChanged={(value) => {
                        console.log(value)
                    }}
                />
                <TextInput
                    onChangeText={(text) => setClaimName(text)}
                    placeHolder={'claim'}
                />
                <Button
                    title="Add Claim"
                    onPress={async () => {
                        await addClaim(claimName)
                        await currentUser.reload() // Since I'm working with my own claims
                    }}
                />
                <Button
                    title="Remove Claim"
                    onPress={async () => {
                        await removeClaim(claimName)
                        await currentUser.reload() // Since I'm working with my own claims
                    }}
                />
                <Button title="Console Log Claims" onPress={() => console.log(claims)} />
                <Button
                    title="Reload Current User"
                    onPress={async () => {
                        await currentUser.reload()
                    }}
                />
            </View>
        </Screen>
    )
    */
    return (
        <Screen navigation={navigation} title="Playground">
            <Text>Hello</Text>
        </Screen>
    )
}
