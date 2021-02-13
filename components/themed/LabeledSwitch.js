import React from 'react'
import { Styles } from '../shared/Constants'
import View from './View'
import Switch from './Switch'
import Text from './Text'

export default ({ label, onChange }) => {
    return (
        <View style={Styles.views.flexRowJustifyCenter}>
            <Text style={{ marginRight: 10 }}>{label}</Text>
            <Switch
                onChange={onChange}
            />
        </View>
    )
}
