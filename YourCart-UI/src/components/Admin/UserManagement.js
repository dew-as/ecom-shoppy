import React, { useEffect, useState } from 'react';
import axiosConfig from '../../api/axiosConfig';
import Modal from 'react-modal';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosConfig.get('users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await axiosConfig.delete(`users/delete/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="container mt-4">
            <h2>User Management</h2>
            <div className="accordion" id="userAccordion">
                {users.map(user => (
                    <div className="card" key={user._id}>
                        <div className="card-header" id={`heading${user._id}`}>
                            <h5 className="mb-0">
                                <button className="btn btn-link" type="button" data-toggle="collapse" data-target={`#collapse${user._id}`} aria-expanded="true" aria-controls={`collapse${user._id}`}>
                                    {user.name}
                                </button>
                                <button className="btn btn-danger float-right" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                            </h5>
                        </div>
                        <div id={`collapse${user._id}`} className="collapse" aria-labelledby={`heading${user._id}`} data-parent="#userAccordion">
                            <div className="card-body">
                                <p>Email: {user.email}</p>
                                <p>Phone: {user.phone}</p>
                                <button className="btn btn-info" onClick={() => openModal(user)}>View Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedUser && (
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <h2>User Details</h2>
                    <p>Name: {selectedUser.name}</p>
                    <p>Email: {selectedUser.email}</p>
                    <p>Phone: {selectedUser.phone}</p>
                    <p>Address: {selectedUser.address.street}, {selectedUser.address.city}, {selectedUser.address.state}, {selectedUser.address.country}, {selectedUser.address.zipCode}</p>
                    <button onClick={closeModal}>Close</button>
                </Modal>
            )}
        </div>
    );
};

export default UserManagement;
