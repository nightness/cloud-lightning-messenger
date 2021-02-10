import React, { useState } from 'react'
import { Text, View, Button, Container, Screen } from '../themed/Components'

// Just started

export default ({ navigation, ...restProps }) => {
    return (
        <Screen navigation={navigation} title={"Manage Districts"} hasBurger={true} hasLogout={true}>
            <Container>
                <Button
                    title='Add'
                />
                <Button
                    title='Remove'
                />
            </Container>
        </Screen>
    )
}
