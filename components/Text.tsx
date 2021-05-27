import React, { useContext, useRef, useEffect } from 'react'
import { Text, View, StyleSheet, StyleProp, TextStyle, ColorValue, TextProps } from 'react-native'
import { ThemeContext } from './ThemeContext'

interface Props extends TextProps {
    children: JSX.Element | JSX.Element[] | string
    style?: StyleProp<TextStyle> | object
    classRef?: React.LegacyRef<Text>
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
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)

    // Setup defaults
    if (!fontWeight) {
        fontWeight = '300'
    }
    if (!fontSize) {
        fontSize = 16
    }

    return (
        <Text
            {...restProps}
            ref={classRef}
            style={[
                getThemedComponentStyle('Text')[activeTheme],
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
