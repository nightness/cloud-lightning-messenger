import React, { useContext, useRef, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes } from '../Constants'

export default ({ children, style, classRef, fontWeight, fontSize, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)

    // Setup defaults
    if (!fontWeight) { fontWeight = "200" }
    if (!fontSize) { fontSize = 14 }

    return (
        <Text
            {...restProps}
            ref={classRef}
            style={[Themes.text[theme], {
                fontWeight: fontWeight, // String
                fontSize: fontSize,     // Integer
            }, style]}
            selectable={false}
        >
            {children}
        </Text>
    )
}

