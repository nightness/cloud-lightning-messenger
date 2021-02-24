import React from 'react'
import { TouchableOpacity, Image } from 'react-native'

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


