// components/EntityViewModal.js
import React from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CLink,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CPopover,
    CRow,
    CTooltip,
  } from '@coreui/react-pro'

const EntityViewModal = ({ visible, onClose, entity, fields, title, columnLabels = {} }) => {
  return (
    <CModal alignment="center" backdrop="static" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {entity ? (
          fields.map((field) => (
            <p key={field}>
              <strong>{columnLabels[field] || field}:</strong> {entity[field]}
            </p>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EntityViewModal;
