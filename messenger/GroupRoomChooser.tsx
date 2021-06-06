import React, { useState, useContext, useEffect, useRef } from 'react'
import { ActivityIndicator, Button, DisplayError, Screen, ScrollView, Text, ThemeContext, Themes } from '../components'
import { StackNavigationProp } from '@react-navigation/stack'
import { DocumentData, FirebaseError, QueryDocumentSnapshot, QuerySnapshot, useCollection } from '../database/Firebase'
import { Styles } from '../app/Styles'
import { View } from 'react-native'
import { DrawerContext, NavigationElement } from '../navigation'
import DynamicMessenger from './DynamicMessenger'

const getScreenConfig = (title: string) => {
    return ({
        // Route names needs to be unique for routing to work, but labels do not need to be unique
        label: title,
        routeName: `${title}-${(Math.floor(Math.random() * 1000000))}`,
        component: DynamicMessenger,
        initialParams: {
            activeTintColor: '#642',
            inactiveTintColor: '#642',
            iconGroup: 'antdesign',
            iconName: 'paperclip',
            focusedIconName: 'bug-outline'
        },
        depth: 1
    }) as NavigationElement
}

// QueryDocumentSnapshot<firebase.firestore.DocumentData>
interface RoomDetailsProps {
    data: QueryDocumentSnapshot<DocumentData>
}

const RoomDetails = ({ data }: RoomDetailsProps) => {
    const { screens, screenIndex, ScreenManager, setBadge } = useContext(DrawerContext)
    const [messageCount, setMessageCount] = useState<number | undefined>();
    const [snapshot, loadingCollection, errorCollection] = useCollection(`${data.ref.path}/messages`)
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    const themeStyle = getThemedComponentStyle('Screen')[activeTheme]
    const docData = data.data()

    useEffect(() => {
        if (loadingCollection || errorCollection) return
        const snap = snapshot as QuerySnapshot<DocumentData>
        setMessageCount(snap.docs.length)
    }, [snapshot])

    return (
        <Button
            style={[{
                borderRadius: 10,
                borderWidth: 2,
                paddingVertical: 5,
                paddingHorizontal: 10,
                marginTop: 5,
                marginHorizontal: 10,
                alignItems: 'baseline'
            }, themeStyle]}
            onPress={() => {
                const screenConfig = getScreenConfig(docData.name)
                if (ScreenManager?.addChild && typeof screenIndex === 'number' && screenIndex >= 0) {
                    const path = ScreenManager.getScreenPath(screenIndex)
                    if (!path) throw new Error('Path Not Found')
                    ScreenManager.addChild(path, screenConfig)
                    //showMessageBox('Completed', `Added a new dynamic child of this screen called '${screenConfig.label}' with a routeName of '${screenConfig.routeName}'`)
                }
            }}
        >
            <View>
                <Text>
                    <Text style={{ fontWeight: 600 }}>Name: </Text>{docData.name}
                </Text>
                {docData.description ?
                    <Text>
                        <Text style={{ fontWeight: 600 }}>Description: </Text>{docData.description}
                    </Text> : <></>
                }
                <Text>
                    <Text style={{ fontWeight: 600 }}>Joined Member Count: </Text>
                    {docData.members ? docData.members.length : 0}
                </Text>
                {messageCount ?
                    <Text>
                        <Text style={{ fontWeight: 600 }}>Message Count: </Text>
                        <Text>{`${messageCount}`}</Text>
                    </Text> : <></>
                }
            </View>
        </Button >
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
                return (
                    <RoomDetails
                        key={`${Math.random()}`}
                        data={data}
                    />
                )
            })}
        </Screen>
    )
}
