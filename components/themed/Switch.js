import React, { useState, useEffect, useContext } from 'react'
import { Switch } from 'react-native'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'

export default ({ children, style, value, onChange, classRef, ...restProps }) => {
    const { theme } = useContext(GlobalContext)

    const trackColor = {
        false: Themes.themedSwitch[theme].trackColorOff,
        true: Themes.themedSwitch[theme].trackColorOn
    }
    const thumbColor = value ?
        Themes.themedSwitch[theme].thumbColorOn :
        Themes.themedSwitch[theme].thumbColorOff

    return (
        <Switch style={[Styles.themedSwitch.default, style]}
            {...restProps}
            ref={classRef}
            trackColor={trackColor}
            thumbColor={thumbColor}
            ios_backgroundColor={Themes.themedSwitch[theme].iosBackgroundColor}
            onValueChange={onChange}
            value={value}
        >
            {children}
        </Switch>
    )
}
