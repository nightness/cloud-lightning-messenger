import React, { useContext, useState, useRef, useEffect } from 'react'
import View from './View'
import TextInput from './TextInput'
import HelperText from './HelperText'
import { GlobalContext } from '../shared/GlobalContext'
import { Theme } from '../shared/Themes'

interface Props {
    formikProps: any
    fieldName: string
    fieldType: any
    placeHolder: string
}

export default ({
    formikProps,
    fieldName,
    fieldType,
    placeHolder,
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
                    if (fieldType) onChangeHandler(text)
                    formikProps.handleChange(fieldName)(text)
                }}
                //placeholder={placeHolder}
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
