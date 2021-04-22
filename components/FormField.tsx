import React from 'react'
import { View } from 'react-native'
import { TextInput }  from 'cloud-lightning-themed-ui'
import HelperText from './HelperText'
import { ReturnKeyTypeOptions } from 'react-native'

interface Props {
    formikProps: any
    fieldName: string
    label?: string
    placeholder?: string
    returnKeyType?: ReturnKeyTypeOptions
    secureTextEntry?: boolean
}

export default ({
    formikProps,
    fieldName,
    label,
    returnKeyType,
    secureTextEntry = false,
    ...restProps
}: Props) =>
    <View>
        <TextInput
            placeholder={label}
            returnKeyType={returnKeyType}
            onChangeText={formikProps.handleChange(fieldName)}
            onKeyPress={(event) => {
                if (event.nativeEvent.key === 'Enter') {
                    if (returnKeyType === 'done')
                        formikProps.handleSubmit()
                    formikProps.preventDefault = true
                    formikProps.stopPropagation = true
                }
            }}
            secureTextEntry={secureTextEntry}
            value={formikProps.values[fieldName]}
            onBlur={formikProps.handleBlur(fieldName)}
            {...restProps}
        />
        <HelperText fontSize={10} type="error">
            {formikProps.touched[fieldName] && formikProps.errors[fieldName]}
        </HelperText>
    </View>
