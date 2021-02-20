import React from 'react'
import Container from './Container'
import Text from './Text'
import { Styles } from '../shared/Constants'

export default ({ permissionDenied, errorMessage, children }) => {
    if (permissionDenied) {
        return (
            <Container style={Styles.views.flatListView}>
                <Text style={Styles.displayError.text}>
                    Permission Denied
                </Text>
            </Container>
        )
    } else if (typeof (errorMessage) === 'string')
        return (
            <Container style={Styles.views.flatListView}>
                <Text style={Styles.displayError.text}>
                    {errorMessage}
                </Text>
            </Container>
        )
    else if (children)
        return (
            <Container style={Styles.views.flatListView}>
                {children}
            </Container>
        )
    else
        return (
            <Container style={Styles.views.flatListView}>
                <Text style={Styles.displayError.text}>
                    An unknown error occurred
                </Text>
            </Container>
        )
}