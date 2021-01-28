import React, { useEffect, useContext, useState, useRef, useMemo } from 'react'
import { FlatList, View, SafeAreaView } from 'react-native'
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
} from './common/Components'
import { getAuth, callFunction, GoogleAuthProvider, useAuthState } from './firebase/Firebase'
import { useStateChanged, useStateDifferences } from './shared/Hooks'
import { FirebaseFlatList } from './firebase/FirebaseFlatList'
import Message from './messenger/Message'
import "./shared/FormValidation"

// Playground
const Playground = ({ navigation }) => {
    const [currentUser, loading, error] = useAuthState();
    const [claimName, setClaimName] = useState('')
    const [userToken, setUserToken] = useState()

    useEffect(() => {
        currentUser.getIdToken(true)
            .then(token => setUserToken(token))
            .catch(err => console.error(err))

    }, [])

    useEffect(() => {
        if (userToken)
            console.log("Notice: User token loaded.")
    }, [userToken])


    const addClaim = async claimName => {
        callFunction('addClaim', {
            userId: currentUser.uid,
            authToken: userToken,
            role: claimName,
        }).then(result => console.log(result))
    }

    const removeClaim = async claimName => {
        callFunction('removeClaim', {
            userId: currentUser.uid,
            authToken: userToken,
            role: claimName,
        }).then(result => console.log(result))
    }

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
            <Screen navigation={navigation} title='Playground' hasLogout={true}>
                <View>
                    <TextInput
                        onChangeText={text => setClaimName(text)}
                        placeHolder={'claim'}
                    />
                    <Button
                        title='Add Claim'
                        onPress={() => addClaim(claimName)}
                    />
                    <Button
                        title='Remove Claim'
                        onPress={() => removeClaim(claimName)}
                    />
                    <Button
                        title='Console Log Claims'
                        onPress={() => {
                            currentUser.getIdTokenResult()
                                .then(idTokenResult => {
                                    console.log(idTokenResult.claims)
                                })
                        }}
                    />
                </View>
            </Screen>
        )
    }
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

