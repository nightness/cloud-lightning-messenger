import React, { useState, useEffect, useContext } from 'react'
import { Switch } from 'react-native'
import { Styles, Themes } from '../shared/Constants'
import { GlobalContext } from '../shared/GlobalContext'

export default ({ children, style, onChange, classRef, ...restProps }) => {
    const [isEnabled, setIsEnabled] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const { theme } = useContext(GlobalContext)
    const toggleSwitch = () => setIsEnabled(previousState => !previousState)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            (typeof onChange === 'function') && onChange(isEnabled)
        }
    }, [isEnabled])

    return (
        <Switch style={[Styles.themedSwitch.default, style]}
            {...restProps}
            ref={classRef}
            trackColor={{
                false: Themes.themedSwitch[theme].trackColorOff,
                true: Themes.themedSwitch[theme].trackColorOn
            }}
            thumbColor={
                isEnabled ?
                    Themes.themedSwitch[theme].thumbColorEnabled :
                    Themes.themedSwitch[theme].thumbColorDisabled
            }
            ios_backgroundColor={Themes.themedSwitch[theme].iosBackgroundColor}
            onValueChange={toggleSwitch}
            value={isEnabled}
        >
            {children}
        </Switch>
    )
}
