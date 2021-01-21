import React, { useEffect, useContext, useState, useRef, useMemo } from 'react'
import { FlatList, View, SafeAreaView } from 'react-native'
import { useAsync } from 'react-async-hook'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { Colors } from 'react-native-paper'
import { Styles, Themes } from './shared/Constants'
import {
    ActivityIndicator,
    DisplayError,
    Screen,
    Container,
    Button,
    Text,
    TextInput,
    FirestoreDocumentView,
    InfiniteScroll,
} from './common/Components'
import { useStateChanged, useStateDifferences } from './shared/Hooks'
import { FirebaseFlatList } from './firebase/FirebaseFlatList'
import Message from './messenger/Message'
import faker from 'faker'

const Playground = () => {
    return (
        <Screen title='Playground' hasLogout={true}>
            <FirebaseFlatList
                autoScrollToEnd={true}
                documentPath='/groups/BF4w762Mt5nxy7MgIIbI'
                collectionPath='/groups/BF4w762Mt5nxy7MgIIbI/messages'
                orderBy='postedAt'
                renderItem={({ item }) => <Message item={item} />}
                onStartReachedThreshold={0.15}
            />
        </Screen>
    )
}

// Playground
const Stack = createStackNavigator()
export default ({ navigation }) => {
    const theme = ''
    return (
        <NavigationContainer
            theme={theme === "Dark" ? DarkTheme : DefaultTheme}
        >
            <Stack.Navigator
                headerMode="none"
            >
                <Stack.Screen
                    name="Playground"
                    component={Playground}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

