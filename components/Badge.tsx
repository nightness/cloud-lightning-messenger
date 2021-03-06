import React from 'react'
import { TouchableWithoutFeedback, ColorValue, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import Text from './Text'

export type FontWeightValues = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"

interface Props {
    value?: string
    color?: ColorValue
    backgroundColor?: ColorValue
    fontSize?: number
    fontWeight?: FontWeightValues
    style?: StyleProp<ViewStyle>
    onPress?: () => any
}

export default ({
    value = '',
    color = 'white',
    backgroundColor = 'blue',
    fontSize,
    fontWeight = '300',
    style,
    onPress,
}: Props) => {
    return (
        <TouchableWithoutFeedback
            onPress={onPress}
            style={style}            
        >
            <Text style={[localStyles.text, { color, fontSize, fontWeight, backgroundColor }]}>{value}</Text>
        </TouchableWithoutFeedback>
    )
}

const localStyles = StyleSheet.create({
    text: {
        borderRadius: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignContent: 'center'
    },
})
