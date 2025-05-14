import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { DocsComponents, DocsExample } from 'src/components'
import { useNavigate } from 'react-router-dom';

const Tables = ({ columns, data, onActions, columnLabels = {} }) => {
  return (
    <CTable striped hover>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          {columns.map((col, colIndex) => (
            <CTableHeaderCell scope="col" key={colIndex}>{columnLabels[col] || col} </CTableHeaderCell>
          ))}
          <CTableHeaderCell scope="col">Action</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
      {Array.isArray(data) && data.length > 0 ? (
        data.map((row, rowIndex) => (
          <CTableRow key={row._id || rowIndex}>
            <CTableHeaderCell scope="row">{rowIndex + 1}</CTableHeaderCell>
            {columns.map((col, colIndex) => (
              <CTableDataCell key={`${row._id || rowIndex}-${colIndex}`}>
                {row[col]}
              </CTableDataCell>
            ))}
            <CTableDataCell>{onActions(row)}</CTableDataCell>
          </CTableRow>
        ))
      ) : (
        <CTableRow>
        <CTableDataCell colSpan={columns.length + 2} className="text-center text-muted">
          No companies found
        </CTableDataCell>
      </CTableRow>
      )}
      </CTableBody>
    </CTable>
  );
};

export default Tables
