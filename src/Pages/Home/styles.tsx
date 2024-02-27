import React, { useState } from 'react';
import Modal from "react-native-modal";

interface DefaultModalProps {
    children: any;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const DefaultModal = (props: DefaultModalProps) => {
    const { children, open, setOpen } = props;

    return (
        <Modal
            isVisible={open}
            onBackdropPress={() => setOpen(false)}
            onBackButtonPress={() => setOpen(false)}
            animationIn='fadeIn'
            animationOut='fadeOut'
            backdropOpacity={0.7}
            backdropColor='black'
            style={{ margin: 0, alignItems: 'center', justifyContent: 'center' }}
            hardwareAccelerated={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
        >
            {children}
        </Modal>
    )
}