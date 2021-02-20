import React from 'react'
import Container from './Container'
import Text from './Text'
import { Styles } from '../shared/Constants'

export default ({ permissionDenied, error }) => {
    let errorMessage = error ? error.message : undefined
    let errorMessageText = permissionDenied ? 'Permission Denied' : errorMessage
    console.error(error)
    return (
        <Container style={Styles.views.filletedBorderView}>
            <Text style={Styles.displayError.header}>
                Sorry, an {!errorMessageText ? 'unknown' : ''} error has occurred
            </Text>
            {errorMessageText &&
                <Text style={Styles.displayError.text}>
                    {errorMessageText}
                </Text>
            }
        </Container>
    )
}