import React from 'react'
import Container from './Container'
import Text from './Text'
import { Styles } from '../shared/Constants'

export default ({ permissionDenied, children, errorMessage = 'An unknown error occurred' }) => {
    let errorMessageText = permissionDenied ? 'Permission Denied' : errorMessage
    return (
        <Container style={Styles.views.filletedBorderView}>
            <Text style={Styles.displayError.text}>
                {errorMessageText}
            </Text>
        </Container>
    )
}