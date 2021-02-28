import React from 'react'
import {
    TouchableOpacity,
    Image,
    GestureResponderEvent,
    ImageSourcePropType,
} from 'react-native'

interface Props {
    disabled?: boolean
    style?: any
    source: ImageSourcePropType
    onPress?: (event: GestureResponderEvent) => void
}

export default ({ disabled, onPress, source, style, ...restProps }: Props) => {
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress}>
            <Image style={style} source={source} {...restProps} />
        </TouchableOpacity>
    )
}
