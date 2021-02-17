import React from 'react'
import { Styles } from '../shared/Constants'
import View from './View'
import Switch from './Switch'
import Text from './Text'

export default ({ label, style, viewStyle, textStyle, key, onChange, ...restProps }) => {
    return (
        <View style={[Styles.views.flexRowJustifyCenter, viewStyle]}>
            <Text style={[{ marginRight: 10 }, textStyle]}>{label}</Text>
            <Switch
                style={style}
                key={key}
                onChange={onChange}
            />
        </View>
    )
}
