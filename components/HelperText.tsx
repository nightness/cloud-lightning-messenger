import React, { useContext, useRef, useEffect } from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { HelperText } from 'react-native-paper'
import { ThemeContext } from 'cloud-lightning-themed-ui'


interface Props {
    children: JSX.Element
    type: 'error' | 'info'
    style?: StyleProp<TextStyle> | object
    fontWeight?: string
    fontSize?: number
}

export default ({ children, style, fontWeight, fontSize, type, ...restProps }: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)

    // Setup defaults
    if (!fontWeight) {
        fontWeight = '200'
    }
    if (!fontSize) {
        fontSize = 14
    }

    return (
        <HelperText
            {...restProps}
            type={type}
            style={[
                getThemedComponentStyle('HelperText')[activeTheme],
                style,
                {
                    fontWeight: fontWeight, // String
                    fontSize: fontSize, // Integer
                },
            ]}
            selectable={false}
        >
            {children}
        </HelperText>
    )
}
