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

export default ({ children, style, fontWeight = '200', fontSize = 14, type, ...restProps }: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ThemeContext)
    return (
        <HelperText
            {...restProps}
            type={type}
            style={[
                getThemedComponentStyle('HelperText')[activeTheme],
                style,
                {
                    fontWeight, // String
                    fontSize, // Integer
                },
            ]}
            selectable={false}
        >
            {children}
        </HelperText>
    )
}
