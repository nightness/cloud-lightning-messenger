import React, { StyleHTMLAttributes } from 'react'
import { Styles } from '../shared/Styles'
import View from './View'
import Switch from './Switch'
import Text from './Text'
import { ActivityIndicator } from 'react-native'

interface Props {
    label: string
    viewStyle: any
    textStyle: any
    isLoading: boolean
}

export default ({ label, viewStyle, textStyle, isLoading, ...restProps }: Props) => {
    return (
        <View style={[Styles.views.flexRowJustifyCenter, viewStyle]}>
            {label ? (
                <Text style={[{ marginRight: 10 }, textStyle]}>{label}</Text>
            ) : (
                <></>
            )}
            {isLoading ? <ActivityIndicator {...restProps} /> : <Switch {...restProps} />}
        </View>
    )
}
