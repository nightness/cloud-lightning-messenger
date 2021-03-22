import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Text, Button, View, Modal } from '../../components/Components'
import { firebaseAuth } from '../../firebase/Firebase'
import { Styles } from '../../app/Styles'

interface Props {
    navigation: StackNavigationProp<any>
    shown: boolean
    dismiss: () => void
}

export const LogoutModal = ({ navigation, shown, dismiss }: Props) => {
    const firebaseLogout = () => {
        firebaseAuth()
            .signOut()
            .then(() => {
                navigation.replace('Authentication')
            })
            .catch((error) => {})
    }

    return (
        <Modal visible={shown} onTouchOutside={() => dismiss && dismiss()}>
            <Text style={Styles.logoutModal.text}>Are you sure you want to logout?</Text>
            <View style={Styles.logoutModal.buttonView}>
                <Button
                    style={Styles.logoutModal.button}
                    title="Yes"
                    onPress={firebaseLogout}
                />
                <Button
                    style={Styles.logoutModal.button}
                    title="No"
                    onPress={() => dismiss && dismiss()}
                />
            </View>
        </Modal>
    )
}
