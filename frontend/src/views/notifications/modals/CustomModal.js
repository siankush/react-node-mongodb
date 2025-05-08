import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react-pro';

const CustomModal = ({
  visible,
  onClose,
  title,
  children,
  onSubmit,
  showFooter = true,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
}) => {
  return (
    <CModal
      alignment="center"
      backdrop="static"
      visible={visible}
      onClose={onClose}
    >
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{children}</CModalBody>
      {showFooter && (
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            {cancelLabel}
          </CButton>
          <CButton color="primary" onClick={onSubmit}>
            {submitLabel}
          </CButton>
        </CModalFooter>
      )}
    </CModal>
  );
};

export default CustomModal;
