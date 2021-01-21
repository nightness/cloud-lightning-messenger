import React from 'react'
import { View } from 'react-native'
import { Text, TextInput } from './Components'

export default (props) => {
    const {
        titleTop,
        titleLeft,
        titleRight,
        titleBottom,
        textStyle,
        textInputStyle, 
        ...restProps // Passed to TextInput
    } = props

    return (
        <View>
            { titleTop && <Text style={textStyle} title={titleTop} />}
            <View style={{ flexDirection: 'row'}}>
                { titleLeft && <Text style={textStyle} title={titleLeft} /> }
                <TextInput {...restProps} style={textInputStyle} />
                { titleRight && <Text style={textStyle} title={titleRight} /> }
            </View>
            { titleBottom && <Text style={textStyle} title={titleBottom} /> }
        </View>
    )
}
