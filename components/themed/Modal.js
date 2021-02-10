import React, { useContext } from 'react'
import { Modal, ModalContent } from 'react-native-modals';
import { GlobalContext } from '../shared/GlobalContext'
import { Themes, Styles } from '../Constants'

export default ({ children, style, ...restProps }) => {
    const { theme, setTheme } = useContext(GlobalContext)

    return (
        <Modal {...restProps} >
            <ModalContent style={[Styles.modal.content, Themes.modal[theme], style]}>
                {children}
            </ModalContent>
        </Modal>

    )
}

