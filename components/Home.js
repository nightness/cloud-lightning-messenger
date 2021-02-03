import React, { useState, useEffect, useContext, PureComponent } from 'react'
import { Screen, Button, Container, Text, ActivityIndicator } from './common/Components'
import { GlobalContext } from './shared/GlobalContext'
import { ProfileContext } from './shared/ProfileContext'
import { Themes } from './shared/Constants'

export default ({ navigation }) => {
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)
    const [name, setName] = useState()
    const profileCache = useContext(ProfileContext)
    const { screenOrientation } = useContext(GlobalContext)

    useEffect(() => {
        console.log(`ScreenOrientation: ${screenOrientation}`)
    }, [screenOrientation]);

    useEffect(() => {
        if (!profileCache) return
        profileCache.hasProfile().then(hasProfile => {
            if (hasProfile) {
                setIsLoadingProfile(false)
                setName(profileCache.getUserName())
            }
        })
    }, [profileCache])

    let children = <ActivityIndicator />
    if (!profileCache.isFetching && !isLoadingProfile) {
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