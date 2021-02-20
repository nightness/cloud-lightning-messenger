import React from 'react'
import Container from './Container'
import Text from './Text'

export default ({ permissionDenied, errorMessage, children }) => {
    if (permissionDenied) {
        return (
            <Container>
                <Text>Permission Denied</Text>
            </Container>
        )
    } else if (typeof (errorMessage) === 'string')
        return (
            <Container>
                <Text>
                    {errorMessage}
                </Text>
            </Container>
        )
    else if (children)
        return (
            <Container>
                {children}
            </Container>
        )
    else
        return (
            <Container>
                <Text>An unknown error occurred</Text>
            </Container>
        )
}