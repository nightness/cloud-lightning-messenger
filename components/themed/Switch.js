import React, { useState, useEffect, useContext } from 'react'
import { Switch } from 'react-native'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'

export default ({ children, style, value, onChange, classRef, ...restProps }) => {
    const { theme } = useContext(GlobalContext)

    return (
        <Switch style={[Styles.themedSwitch.default, style]}
            {...restProps}
            ref={classRef}
            trackColor={{
                false: Themes.themedSwitch[theme].trackColorOff,
                true: Themes.themedSwitch[theme].trackColorOn
            }}
            thumbColor={
                value ?
                    Themes.themedSwitch[theme].thumbColorEnabled :
                    Themes.themedSwitch[theme].thumbColorDisabled
            }
            ios_backgroundColor={Themes.themedSwitch[theme].iosBackgroundColor}
            onValueChange={onChange}
            value={value}
        >
            {children}
        </Switch>
    )
}
