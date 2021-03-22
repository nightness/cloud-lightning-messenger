import React, { useContext, useRef, useEffect } from 'react'
import { Text, View, StyleSheet, StyleProp, TextStyle, ColorValue, TextProps } from 'react-native'
import { GlobalContext } from '../app/GlobalContext'
import { Themes } from '../app/Themes'

interface Props extends TextProps {
    children: JSX.Element | JSX.Element[] | string
    style?: StyleProp<TextStyle> | object
    classRef?: any
    fontWeight?: string
    fontSize?: number
    color?: ColorValue
}

export default ({
    children,
    style,
    classRef,
    fontWeight,
    fontSize,
    color,
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
                    fontWeight, // String
                    fontSize, // Integer
                },
                style,
            ]}
            selectable={false}
        >
            {children}
        </Text>
    )
}
