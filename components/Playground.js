import React, { useEffect, useContext, useState, useRef, useMemo } from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { View } from './themed/Components'
import { useAsync } from 'react-async-hook'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import Authentication from './Authentication'
import faker from 'faker'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Colors } from 'react-native-paper'
import { Styles, Themes } from './shared/Constants'
import {
    ActivityIndicator,
    DisplayError,
    Screen,
    Container,
    FormField,
    Button,
    Text,
    TextInput,
    FirestoreDocumentView,
    InfiniteScroll,
} from './themed/Components'
import { useAuthState } from './firebase/Firebase'
import { FirebaseContext } from './firebase/FirebaseContext'
import "./shared/FormValidation"

const fetchStuff = async () => true
const fetchResult = (async () => {
    try {
        return await fetchStuff()
    } catch (error) { }
})()

// Playground
export const Playground = ({ navigation }) => {
    const { currentUser, claims, addClaim, removeClaim } = useContext(FirebaseContext)
    const [claimName, setClaimName] = useState()

    useEffect(() => {
        if (!currentUser) return
        console.log(currentUser)
    }, [currentUser])

    const reloadCurrentUser = async () => {
        console.log('--- reload ---')
        const result = await currentUser.reload()
        console.log(result)
    }

    return (
        <Screen navigation={navigation} title='Playground'>
            <View>
                <TextInput
                    onChangeText={text => setClaimName(text)}
                    placeHolder={'claim'}
                />
                <Button
                    title='Add Claim'
                    onPress={async () => {
                        await addClaim(claimName)
                        await reloadCurrentUser()
                    }}
                />
                <Button
                    title='Remove Claim'
                    onPress={async () => {
                        await removeClaim(claimName)
                        await reloadCurrentUser()
                    }}
                />
                <Button
                    title='Console Log Claims'
                    onPress={() => console.log(claims)}
                />
                <Button
                    title='Reload Current User'
                    onPress={reloadCurrentUser}
                />
            </View>
        </Screen>
    )
}

const Stack = createStackNavigator()
export default ({ navigation }) => {
    const theme = ''
    const [currentUser, loading, error] = useAuthState();

    if (loading) {
        return (
            <Screen title='Playground'>
                <ActivityIndicator />
            </Screen>
        )
    }
    else if (error) {
        return (
            <Screen title='Playground'>
                <DisplayError errorMessage={"Firebase Error: " + firebaseError.message} />
            </Screen>
        )
    }
    else {
        return (
            <NavigationContainer
                theme={theme === "Dark" ? DarkTheme : DefaultTheme}
            >
                <Stack.Navigator
                    initialRouteName={currentUser ? "Main" : "Authentication"}
                    headerMode="none"
                >
                    <Stack.Screen name="Authentication" component={Authentication} />
                    <Stack.Screen
                        name="Main"
                        component={Playground}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}
