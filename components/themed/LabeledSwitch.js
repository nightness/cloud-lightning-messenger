import React from 'react'
import { Styles } from '../shared/Constants'
import View from './View'
import Switch from './Switch'
import Text from './Text'

export default ({ label, style, textStyle, key, onChange, ...restProps }) => {
    return (
        <View style={[Styles.views.flexRowJustifyCenter, style]}>
            <Text style={[{ marginRight: 10 }, textStyle]}>{label}</Text>
            <Switch
                key={key}
                onChange={onChange}
            />
        </View>
    )
}
