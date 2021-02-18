import React from 'react'
import { Styles } from '../shared/Constants'
import View from './View'
import Switch from './Switch'
import Text from './Text'
import { ActivityIndicator } from 'react-native'

export default ({ label, viewStyle, textStyle, isLoading, ...restProps }) => {
    return (
        <View style={[Styles.views.flexRowJustifyCenter, viewStyle]}>
            {label && <Text style={[{ marginRight: 10 }, textStyle]}>{label}</Text>}
            {isLoading ? <ActivityIndicator {...restProps} /> : <Switch {...restProps} />}
        </View>
    )
}
