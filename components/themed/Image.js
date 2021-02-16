import React, { useContext } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../shared/Constants'

export default ({ disabled, onPress, ...restProps }) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
        >
            <Image {...restProps} />
        </TouchableOpacity>
    )
}


