import React, { useState, useContext, useEffect, useRef } from 'react'
import { ActivityIndicator, DisplayError, Screen, ScrollView, Text, ThemeContext, Themes } from '../components'
import { StackNavigationProp } from '@react-navigation/stack'
import { DocumentData, FirebaseError, QueryDocumentSnapshot, QuerySnapshot, useCollection } from '../database/Firebase'
import { Styles } from '../app/Styles'
import { View } from 'react-native'

// QueryDocumentSnapshot<firebase.firestore.DocumentData>
interface RoomDetailsProps {
    data: QueryDocumentSnapshot<DocumentData>
}

const RoomDetails = ({ data }: RoomDetailsProps) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    const themeStyle = getThemedComponentStyle('Screen')[activeTheme]
    const item = data.data()

    return (
        <View style={[{
            borderRadius: 10,
            borderWidth: 2,
            paddingVertical: 5,
            paddingHorizontal: 10,
            marginTop: 5,
            marginHorizontal: 10,
        }, themeStyle]}>
            <Text>
                <Text style={{ fontWeight: 600 }}>Name: </Text>{item.name}
            </Text>
            { item.description ?
                <Text>
                    <Text style={{ fontWeight: 600 }}>Description: </Text>{item.description}
                </Text> : <></>
            }
            <Text>
                <Text style={{ fontWeight: 600 }}>Joined Member Count: </Text>
                {item.members ? item.members.length : 0}</Text>
        </View>
    )
}

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const [snapshot, loadingCollection, errorCollection] = useCollection('/groups')

    if (loadingCollection) {
        return (
            <Screen navigation={navigation} title=''>
                <ActivityIndicator viewStyle={Styles.views.activityIndicator} />
            </Screen>
        )
    } else if (errorCollection) {
        return <DisplayError error={errorCollection as FirebaseError} />
    }
    return (
        <Screen navigation={navigation} title={'Group Chat Rooms'}>
            {(snapshot as QuerySnapshot<DocumentData>).docs.map((data) => {
                return <RoomDetails key={`${Math.random()}`} data={data} />
            })}
        </Screen>
    )
}
