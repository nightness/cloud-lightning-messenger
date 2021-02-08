import React, { useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'

export default ({ style, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)
    //const properTheme = !disabled ? Themes.button[theme] : Themes.buttonDisabled[theme]

    const iconColor = Themes.materialIcons[theme].color

    return (
        <MaterialIcons
            style={[Styles.materialIcons.icons, style]}
            color={iconColor}
            selectable={false}
            {...restProps}
        />
    )
}


