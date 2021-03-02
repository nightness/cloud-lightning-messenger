import React, { useContext, useRef, useEffect } from 'react'
import { Text, View, StyleSheet, StyleProp, TextStyle } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes } from '../shared/Themes'

interface Props {
    children: JSX.Element[] | string
    style?: StyleProp<TextStyle> | object
    classRef?: any
    fontWeight?: string
    fontSize?: number
}

export default ({
    children,
    style,
    classRef,
    fontWeight,
    fontSize,
    ...restProps
}: Props) => {
    const { theme } = useContext(GlobalContext)

    // Setup defaults
    if (!fontWeight) {
        fontWeight = '200'
    }
    if (!fontSize) {
        fontSize = 14
    }

    return (
        <Text
            {...restProps}
            ref={classRef}
            style={[
                Themes.text[theme],
                {
                    fontWeight: fontWeight, // String
                    fontSize: fontSize, // Integer
                },
                style,
            ]}
            selectable={false}
        >
            {children}
        </Text>
    )
}
