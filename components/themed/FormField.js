import React, { useContext, useState, useRef, useEffect } from 'react'
import { View } from 'react-native'
import TextInput from './TextInput'
import HelperText from './HelperText'
import { Styles, Themes } from '../Constants'
import { GlobalContext } from '../shared/GlobalContext'

export default ({ formikProps, fieldName, fieldType, placeHolder, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)

    const onChangeHandler = text => {
        //if (fieldType === 'phone-number')
        //    formatPhoneNumber(text)
    }

    return (
        <View>
            <TextInput
                onChangeText={text => {
                    if (fieldType)
                        onChangeHandler(text)
                    formikProps.handleChange(fieldName)(text)
                }}
                placeholder={placeHolder}
                value={formikProps.values[fieldName]}
                onBlur={formikProps.handleBlur(fieldName)}
                keyboardAppearance={theme.toLowerCase()}
                {...restProps}
            />
            <HelperText fontSize={10}>{formikProps.touched[fieldName] && formikProps.errors[fieldName]}</HelperText>
        </View>
    )
}
