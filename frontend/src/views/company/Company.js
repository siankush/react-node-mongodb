import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { cilTrash } from '@coreui/icons';
import { DocsComponents, DocsExample } from 'src/components'
import { useNavigate } from 'react-router-dom';
import Tables from '../base/tables/Tables';
import EntityViewModal from '../notifications/modals/EntityViewModal';
import CustomModal from '../notifications/modals/CustomModal';

const Company = () => {
    const [formData, setFormData] = useState({
      name: '',
      industry: '',
      website: '',
      phone: '',
      address: ''
    });
    
    const [companies, setCompanies] = useState([]);
    const [companyColumns, setCompanyColumns] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [viewCompany, setViewCompany] = useState(null);
    const [toastList, setToastList] = useState([]);
    const navigate = useNavigate();
    const companyColumnLabels = {
      name: 'Name',
      industry: 'Industry',
      website: 'Website',
      phone: 'Phone',
      address: 'Address'
    };
    const [isAdmin, setIsAdmin] = useState(false);
    
    const handleView = (company) => {
      setViewCompany(company);
      setModalVisible(true);
    };

    const handleEdit = (company) => {
      setIsEditMode(true); // set to edit mode
      setSelectedCompany(company);
      setFormData({ name: company.name, industry: company.industry, website: company.website, phone: company.phone, address: company.address });
      setShowModal(true);
    };

    const handleUpdateCompany = async () => {
      try {
            const token = localStorage.getItem('token')
            const res = await axios.put(`http://localhost:5000/api/companies/${selectedCompany._id}`,
              formData,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setCompanies((prev) =>
              prev.map((u) => (u._id === selectedCompany._id ? res.data : u))
            )
            setShowModal(false)
          } catch (err) {
            alert('Error updating company');
            console.error(err);
          }
    };
    

    const handleOpenAddModal = () => {
      setFormData({
        name: '',
        industry: '',
        website: '',
        phone: '',
        address: ''
      });
      setIsEditMode(false);
      setShowModal(true);
    };
    
    const handleCloseModal = () => {
      setShowModal(false);
    };

    
    const handleAddCompany = async () => {
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      try {
        const payload = {
          ...formData,
          createdBy: decoded.id, // Add user ID from token
        };
        const res = await axios.post('http://localhost:5000/api/companies', payload);
        handleCloseModal();
      } catch (err) {
        alert('Error adding company');
      }
    };
    
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this company?');
        if (!confirmDelete) return;
        try {
          await axios.delete(`http://localhost:5000/api/companies/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setCompanies(companies.filter((u) => u._id !== id));
        } catch (err) {
          console.error(err);
      };
    }

    useEffect(() => {
      const token = localStorage.getItem('token');
      if(token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decoded.role === 'admin');
      } else {
        navigate('/login');
        return;
      }
  
      axios.get('http://localhost:5000/api/companies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        setCompanies(data);
        setCompanyColumns(['name', 'industry', 'website', 'phone', 'address']);
      })
      .catch((err) => {
        console.error(err);
        // Redirect to login on 400 or 401 errors
        if (err.response && (err.response.status === 400 || err.response.status === 401)) {
          navigate('/login');
        }
      });


    }, [navigate]);
  
    return (
      <>
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          Add Company
        </button>
      </div>

      <CRow>
        <CCol>
          <CCard>
            <CCardHeader><strong>Companies</strong></CCardHeader>
            <CCardBody>
              <Tables
                columns={companyColumns}
                data={companies}
                onActions={(company) => (
                  <>
                    <button onClick={() => handleView(company)} className="btn btn-sm btn-info me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="icon" role="img" aria-hidden="true">
                        <path fill="currentColor" d="M572.52 241.4c-1.51-1.95-37.48-48.1-93.12-86.1C428.52 123.4 375.78 96 288 96S147.48 123.4 96.6 155.3c-55.64 38-91.61 84.15-93.12 86.1a48.37 48.37 0 0 0 0 29.2c1.51 1.95 37.48 48.1 93.12 86.1C147.48 388.6 200.22 416 288 416s140.52-27.4 191.4-59.3c55.64-38 91.61-84.15 93.12-86.1a48.37 48.37 0 0 0 0-29.2zM288 368c-70.69 0-128-57.31-128-128s57.31-128 128-128 128 57.31 128 128-57.31 128-128 128zm0-208a80 80 0 1 0 80 80 80.09 80.09 0 0 0-80-80z"/>
                      </svg>
                    </button>
                    <button onClick={() => handleEdit(company)} className="btn btn-sm btn-warning me-2">
                      <CIcon icon={cilPencil} />
                    </button>
                    { isAdmin && (
                    <button onClick={() => handleDelete(company._id)} className="btn btn-sm btn-danger">
                      <CIcon icon={cilTrash} />
                    </button>
                    )}
                  </>
                )}
                columnLabels={companyColumnLabels}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CustomModal
        visible={showModal}
        onClose={handleCloseModal}
        title={isEditMode ? 'Edit Company' : 'Add Company'}
        onSubmit={isEditMode ? handleUpdateCompany : handleAddCompany}
        submitLabel={isEditMode ? 'Save Changes' : 'Add Company'}
      >
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="name">Company Name</CFormLabel>
            <CFormInput
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="industry">Industry</CFormLabel>
            <CFormInput
              type="text"
              id="industry"
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="website">Website</CFormLabel>
            <CFormInput
              type="text"
              id="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="phone">Phone</CFormLabel>
            <CFormInput
              type="text"
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="address">Address</CFormLabel>
            <CFormInput
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
        </CForm>
      </CustomModal>

      {/* Modal */}
      <EntityViewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        entity={viewCompany}
        fields={companyColumns}
        title="Company Details"
        columnLabels={companyColumnLabels}
      />
      </>
    );
  };

export default Company