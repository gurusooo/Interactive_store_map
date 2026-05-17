import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/modal';
import { Button } from '@chakra-ui/react';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmBgColor?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    confirmBgColor = '#f08c1f',
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            blockScrollOnMount={true}
            closeOnOverlayClick={false}
            closeOnEsc={true}
            returnFocusOnClose={true}
            size="xs"
        >
            <ModalOverlay
                className={styles.overlay}
                bg="rgba(0, 0, 0, 0.6)"
                backdropFilter="blur(2px)"
            />
            <ModalContent
                className={styles.content}
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: 'auto' }}
            >
                <ModalHeader className={styles.header}>{title}</ModalHeader>
                <ModalBody className={styles.body}>{message}</ModalBody>
                <ModalFooter className={styles.footer}>
                    <Button variant="ghost" onClick={onClose} className={styles.cancelBtn}>
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={styles.confirmBtn}
                        bg={confirmBgColor}
                        _hover={{ bg: confirmBgColor, opacity: 0.8 }}
                        color="white"
                    >
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
