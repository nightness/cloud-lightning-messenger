import React, { useState, useEffect, useContext, PureComponent } from 'react'
import { Screen, Button, Container, Text, ActivityIndicator } from './common/Components'
import { GlobalContext } from './shared/GlobalContext'
import { ProfileContext } from './shared/ProfileContext'
import { Themes } from './shared/Constants'

export default ({ navigation }) => {
    const [name, setName] = useState()
    const profileCache = useContext(ProfileContext)
    const { screenOrientation } = useContext(GlobalContext)

    useEffect(() => {
        console.log(`ScreenOrientation: ${screenOrientation}`)
    }, [screenOrientation]);

    // BUG: And this doesn't fix it, when logging in with a google account, 
    // Get rid of this profile cache idea!!!
    useEffect(() => {
        if (profileCache)
            setName(profileCache.getUserName())
    }, [profileCache])

    let children = <ActivityIndicator />
    if (!profileCache.isFetching) {
        children =
            <Text>Welcome {name}</Text>
    }

    return (
        <Screen
            navigation={navigation}
            hasBurger={true}
            hasLogout={true}
            title="Home"
        >
            {children}
        </Screen>
    )
}