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
    const [messageCount, setMessageCount] = useState<number | undefined>();
    const [snapshot, loadingCollection, errorCollection] = useCollection(`${data.ref.path}/messages`)
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    const themeStyle = getThemedComponentStyle('Screen')[activeTheme]
    const docData = data.data()

    console.log(`${data.ref.path}/messages`)

    useEffect(() => {
        if (loadingCollection || errorCollection) return
        const snap = snapshot as QuerySnapshot<DocumentData>
        setMessageCount(snap.docs.length)
    }, [snapshot])

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
                <Text style={{ fontWeight: 600 }}>Name: </Text>{docData.name}
            </Text>
            { docData.description ?
                <Text>
                    <Text style={{ fontWeight: 600 }}>Description: </Text>{docData.description}
                </Text> : <></>
            }
            <Text>
                <Text style={{ fontWeight: 600 }}>Joined Member Count: </Text>
                {docData.members ? docData.members.length : 0}
            </Text>
            { messageCount ?
                <Text>
                    <Text style={{ fontWeight: 600 }}>Message Count: </Text>
                    <Text>{`${messageCount}`}</Text>
                </Text> : <></>
            }
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
