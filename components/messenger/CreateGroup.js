import React, { useState } from 'react'
import { Modal, View } from 'react-native'
import { Text, Button } from '../common/Components'
import { Overlay } from 'react-native-elements'

export default function CreateGroup(props) {
    const [isVisible, setIsVisible] = useState(false)
    return (
        <Overlay
            visible={isVisible}
            onBackdropPress={setIsVisible(!isVisible)}
        >
            <Button
                title='Add Memebers'
            />
            <Button
                title='Create Group'
                onClick={() => setIsVisible(false)}
            />
        </Overlay>
    )
}
