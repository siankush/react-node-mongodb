import React, { useEffect, useState } from 'react'
import axios from 'axios';

import {
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
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { cilTrash } from '@coreui/icons';
import { DocsComponents, DocsExample } from 'src/components'
import { useNavigate } from 'react-router-dom';
import Tables from '../base/tables/Tables';
import EntityViewModal from '../notifications/modals/EntityViewModal';
import CustomModal from '../notifications/modals/CustomModal';

const User = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
    });
    const [users, setUsers] = useState([]);
    const [userColumns, setUserColumns] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // const [visible, setVisible] = useState(false);
    // const [formData, setFormData] = useState({ username: '', email: '' });

    // const handleOpen = () => setVisible(true);
    // const handleClose = () => setVisible(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewUser, setViewUser] = useState(null);
    const navigate = useNavigate();
  

    const handleView = (user) => {
      setViewUser(user);
      setModalVisible(true);
    };

    const handleAddUser = () => {
      // Add user logic
      console.log('add');
    };

    const handleEdit = (user) => {
        setIsEditMode(true); // set to edit mode
        setSelectedUser(user);
        setEditForm({ username: user.username, email: user.email, password: '' });
        setShowModal(true);
    };


    const handleDelete = async (id) => {
      console.log(id);
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;
        try {
          await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setUsers(users.filter((u) => u._id !== id));
        } catch (err) {
          console.error(err);
      };
    }
      
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }
  
      axios.get('http://localhost:5000/api/auth/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        setUsers(data);
        console.log(data);
        setUserColumns(['username', 'email']);
        // Show all column from database
        // if (data.length > 0) {
        //   const columns = Object.keys(data[0]);
        //   console.log(columns);
        //   setUserColumns(columns);
        // }
      })
      .catch((err) => {
        console.error(err);
        // Redirect to login on 400 or 401 errors
        if (err.response && (err.response.status === 400 || err.response.status === 401)) {
          console.log('Invalid or expired token, redirecting to login');
          navigate('/login');
        }
      });
    }, [navigate]);
  
    return (
      <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader><strong>Users</strong></CCardHeader>
            <CCardBody>
              <Tables
                columns={userColumns}
                data={users}
                onActions={(user) => (
                  <>
                    <button onClick={() => handleView(user)} className="btn btn-sm btn-info me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="icon" role="img" aria-hidden="true">
                        <path fill="currentColor" d="M572.52 241.4c-1.51-1.95-37.48-48.1-93.12-86.1C428.52 123.4 375.78 96 288 96S147.48 123.4 96.6 155.3c-55.64 38-91.61 84.15-93.12 86.1a48.37 48.37 0 0 0 0 29.2c1.51 1.95 37.48 48.1 93.12 86.1C147.48 388.6 200.22 416 288 416s140.52-27.4 191.4-59.3c55.64-38 91.61-84.15 93.12-86.1a48.37 48.37 0 0 0 0-29.2zM288 368c-70.69 0-128-57.31-128-128s57.31-128 128-128 128 57.31 128 128-57.31 128-128 128zm0-208a80 80 0 1 0 80 80 80.09 80.09 0 0 0-80-80z"/>
                      </svg>
                    </button>
                    <button onClick={() => handleEdit(user)} className="btn btn-sm btn-warning me-2">
                      <CIcon icon={cilPencil} />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="btn btn-sm btn-danger">
                      <CIcon icon={cilTrash} />
                    </button>
                  </>
                )}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CustomModal
        visible={showModal}
        // onClose={handleCloseModal}
        title={isEditMode ? 'Edit User' : 'Add User'}
        onSubmit={isEditMode ? handleUpdateUser : handleAddUser}
        submitLabel={isEditMode ? 'Save Changes' : 'Add User'}
      >
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="username">Username</CFormLabel>
            <CFormInput
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          {!isEditMode && (
            <div className="mb-3">
              <CFormLabel htmlFor="password">Password</CFormLabel>
              <CFormInput
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          )}
        </CForm>
      </CustomModal>

      {/* Modal */}
      <EntityViewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        entity={viewUser}
        fields={userColumns}
        title="User Details"
      />
      </>
    );
  };

export default User