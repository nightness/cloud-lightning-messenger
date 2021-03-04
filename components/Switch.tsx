import React, { useState, useEffect, useContext } from 'react'
import { ColorValue, StyleProp, Switch, ViewStyle } from 'react-native'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import { GlobalContext } from '../shared/GlobalContext'

interface Props {
    style?: StyleProp<ViewStyle>
    value?: boolean
    onChange?: (value: boolean) => void
    classRef?: any
}

export default ({ style, value, onChange, classRef, ...restProps }: Props) => {
    const { theme } = useContext(GlobalContext)

    const trackColor = {
        false: Themes.themedSwitch[theme].trackColorOff as ColorValue,
        true: Themes.themedSwitch[theme].trackColorOn as ColorValue,
    }
    const thumbColor = value
        ? Themes.themedSwitch[theme].thumbColorOn
        : Themes.themedSwitch[theme].thumbColorOff

    return (
        <Switch
            style={[style]}
            {...restProps}
            ref={classRef}
            trackColor={trackColor}
            thumbColor={thumbColor}
            ios_backgroundColor={Themes.themedSwitch[theme].iosBackgroundColor}
            onValueChange={onChange}
            value={value}
        />
    )
}
