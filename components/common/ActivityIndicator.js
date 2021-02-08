import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Styles } from '../Constants'

export default () => {
    return (
        <View style={Styles.views.activityIndicator}>
            <ActivityIndicator size="large" />
        </View>
    )
}
