import React from 'react'
import Container from './Container'
import Text from './Text'
import { Styles } from '../shared/Styles'

interface Props {
    permissionDenied?: boolean
    error?: any
}

export default ({ permissionDenied, error }: Props) => {
    let _errorMessage = error ? error.message : undefined
    let errorMessageText = permissionDenied ? 'Permission Denied' : _errorMessage
    console.error(error)
    return (
        <Container style={Styles.views.filletedBorderView}>
            <Text style={Styles.displayError.header}>
                {`Sorry, an ${
                    !errorMessageText ? 'unknown error' : 'error'
                } has occurred`}
            </Text>
            {errorMessageText && (
                <Text style={Styles.displayError.text}>{errorMessageText}</Text>
            )}
        </Container>
    )
}