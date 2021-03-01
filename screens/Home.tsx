import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState, useEffect, useContext, PureComponent } from 'react'
import {
    Screen,
    Button,
    Container,
    Text,
    ActivityIndicator,
} from '../components/Components'
import { GlobalContext } from '../shared/GlobalContext'
import { ProfileContext } from '../shared/ProfileContext'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const [name, setName] = useState()
    const profileCache = useContext(ProfileContext)
    const { screenOrientation } = useContext(GlobalContext)

    useEffect(() => {
        console.log(`ScreenOrientation: ${screenOrientation}`)
    }, [screenOrientation])

    useEffect(() => {
        if (!profileCache) return
        const username = profileCache.getUserName()
        if (username) {
            setName(username)
        }
    }, [profileCache.cachedUsers])

    let children = <ActivityIndicator />
    if (!profileCache.isFetching) {
        children = <Text>Welcome {name}</Text>
    }

    return (
        <Screen navigation={navigation} title="Home">
            {children}
        </Screen>
    )
}
