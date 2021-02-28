import React, { useContext } from 'react'
import { Modal, ModalContent } from 'react-native-modals'
import { GlobalContext } from '../shared/GlobalContext'
import { Styles } from '../shared/Styles'
import { Themes } from '../shared/Themes'
import { StyleProp, ViewStyle } from 'react-native'

interface Props {
    children: JSX.Element[]
    style?: StyleProp<ViewStyle>
}

export default ({ children, style, ...restProps }: Props) => {
    const { theme } = useContext(GlobalContext)

    return (
        <Modal {...restProps}>
            <ModalContent style={[Styles.modal.content, Themes.modal[theme], style]}>
                {children}
            </ModalContent>
        </Modal>
    )
}
