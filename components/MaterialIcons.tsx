import React, { useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import { GestureResponderEvent } from 'react-native'

interface Props {
    style?: any
    name: string
    size?: number
    onPress?: (event: GestureResponderEvent) => void
}

export default ({ style, name, size, onPress, ...restProps }: Props) => {
    const { theme } = useContext(GlobalContext)
    //const properTheme = !disabled ? Themes.button[theme] : Themes.buttonDisabled[theme]

    const iconColor = Themes.materialIcons[theme].color

    return (
        <MaterialIcons
            style={[Styles.materialIcons.icons, style]}
            name={name}
            size={size}
            onPress={onPress}
            color={iconColor}
            selectable={false}
            {...restProps}
        />
    )
}
