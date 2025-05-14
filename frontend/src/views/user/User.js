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

const User = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
    });
    const [users, setUsers] = useState([]);
    const [userColumns, setUserColumns] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewUser, setViewUser] = useState(null);
    const [toastList, setToastList] = useState([]);
    const navigate = useNavigate();
    const userColumnLabels = {
      username: 'Username',
      email: 'Email',
    };
    const [authId, setAuthId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const showToast = (title, message, color = 'success') => {
      const toast = (
        <CToast key={Date.now()} className={`text-white bg-${color}`} delay={3000} autohide>
          <CToastHeader closeButton>{title}</CToastHeader>
          <CToastBody>{message}</CToastBody>
        </CToast>
      );
      setToastList((prev) => [...prev, toast]);
    };
    

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
      setFormData({ username: user.username, email: user.email, password: '' });
      setShowModal(true);
    };
    
    const handleUpdateUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.put(
          `http://localhost:5000/api/auth/users/${selectedUser._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
    
        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? res.data : u))
        )
        setShowModal(false)
        showToast('Success', 'User added successfully!', 'success');
      } catch (err) {
        console.error(err)

      }
    }
    

    const handleDelete = async (id) => {
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

    const handleCloseModal = () => {
      setShowModal(false);
      setFormData({ username: '', email: '', password: '' });
      setIsEditMode(false);
      setSelectedUser(null);
    };


    useEffect(() => {
      const token = localStorage.getItem('token');
      if(token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setAuthId(decoded.id);            // Store logged-in user's ID
        setIsAdmin(decoded.role === 'admin');
      } else {
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
          navigate('/login');
        }
      });

      // setTimeout(() => {
      //   showToast({
      //     title: 'Test',
      //     message: 'Now the ref is ready!',
      //   })
      // }, 1000) // Enough delay for CToaster to mount

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
                    {(isAdmin || user._id === authId) && (
                    <button onClick={() => handleEdit(user)} className="btn btn-sm btn-warning me-2">
                      <CIcon icon={cilPencil} />
                    </button>
                    )}
                    {isAdmin && (
                    <button onClick={() => handleDelete(user._id)} className="btn btn-sm btn-danger">
                      <CIcon icon={cilTrash} />
                    </button>
                    )}
                  </>
                )}
                columnLabels={userColumnLabels}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CustomModal
        visible={showModal}
        onClose={handleCloseModal}
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

      {/* Display the toast messages */}
      <CToaster position="top-end">
        {toastList}
      </CToaster>
      {/* {toast && toaster.current?.push(toaster)} */}
      
      {/* <CButton color="primary" onClick={() => addToast(exampleToast)}>
        Send a toast
      </CButton>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} /> */}

      {/* <CToaster position="top-end">
        {toastVisible && (
          <CustomToast
            title="Success"
            message="User updated successfully!"
            timestamp="Now"
            color="#198754" // green
          />
        )}
      </CToaster> */}

      {/* Modal */}
      <EntityViewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        entity={viewUser}
        fields={userColumns}
        title="User Details"
        columnLabels={userColumnLabels}
      />
      </>
    );
  };

export default User