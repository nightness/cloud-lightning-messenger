import React from 'react'
import { Styles } from '../shared/Constants'
import View from './View'
import Switch from './Switch'
import Text from './Text'

export default ({ label, style, viewStyle, textStyle, key, onChange, ...restProps }) => {
    return (
        <View style={[Styles.views.flexRowJustifyCenter, viewStyle]}>
            {label && <Text style={[{ marginRight: 10 }, textStyle]}>{label}</Text>}
            <Switch
                style={style}
                onChange={onChange}
                {...restProps}
            />
        </View>
    )
}
