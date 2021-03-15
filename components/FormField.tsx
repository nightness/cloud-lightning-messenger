import React, { useContext, useState, useRef, useEffect } from 'react'
import View from './View'
import TextInput from './TextInput'
import HelperText from './HelperText'
import { GlobalContext } from '../shared/GlobalContext'
import { Theme } from '../shared/Themes'

interface Props {
    formikProps: any
    fieldName: string
    //fieldType: any
    placeholder?: string
    secureTextEntry?: boolean
}

export default ({
    formikProps,
    fieldName,
    //fieldType,
    placeholder,
    secureTextEntry = false,
    ...restProps
}: Props) => {
    const { theme } = useContext(GlobalContext)

    const onChangeHandler = (text: string) => {
        //if (fieldType === 'phone-number')
        //    formatPhoneNumber(text)
    }

    return (
        <View>
            <TextInput
                onChangeText={(text) => {
                    //if (fieldType) onChangeHandler(text)
                    formikProps.handleChange(fieldName)(text)
                }}
                onKeyPress={(event) => {
                    if (event.nativeEvent.key == 'Enter')
                        return formikProps.handleSubmit()
                }}
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                value={formikProps.values[fieldName]}
                onBlur={formikProps.handleBlur(fieldName)}
                keyboardAppearance={theme}
                {...restProps}
            />
            <HelperText fontSize={10} type="error">
                {formikProps.touched[fieldName] && formikProps.errors[fieldName]}
            </HelperText>
        </View>
    )
}
