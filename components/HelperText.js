import React, { useContext, useRef, useEffect } from 'react'
import { HelperText } from 'react-native-paper'
import { GlobalContext } from '../shared/GlobalContext'
import { Themes } from '../shared/Constants'

export default ({ children, style, fontWeight, fontSize, ...restProps }) => {
    const { theme } = useContext(GlobalContext)

    // Setup defaults
    if (!fontWeight) { fontWeight = "200" }
    if (!fontSize) { fontSize = 14 }

    return (
        <HelperText
            {...restProps}
            style={[Themes.helperText[theme], style, {
                fontWeight: fontWeight, // String
                fontSize: fontSize,     // Integer
            }]}
            selectable={false}
        >
            {children}
        </HelperText>
    )
}

