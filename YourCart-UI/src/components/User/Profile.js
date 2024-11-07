import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/slices/authSlice';
import checkAuth from '../../auth/checkAuth';
import axiosConfig from '../../api/axiosConfig';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    // Local state to manage user data for editing
    const [editableUserData, setEditableUserData] = useState(userData);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        // Set local state whenever userData changes
        setEditableUserData(userData);
    }, [userData]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setEditableUserData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosConfig.post('users/addAddress', editableUserData.address);
            navigate('/'); // Redirect after successful address update
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit} className="border p-4 rounded">
                <h2>Profile</h2>
                <div className="mb-3">
                    <label>Name:</label>
                    <input type="text" value={editableUserData.name} readOnly className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Email:</label>
                    <input type="email" value={editableUserData.email} readOnly className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Phone:</label>
                    <input type="text" value={editableUserData.phone} readOnly className="form-control" />
                </div>
                <h3>Address</h3>
                <div className="mb-3">
                    <label>Street:</label>
                    <input
                        type="text"
                        name="street"
                        value={editableUserData?.address?.street || ''}
                        onChange={handleAddressChange}
                        placeholder="Street"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={editableUserData?.address?.city || ''}
                        onChange={handleAddressChange}
                        placeholder="City"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label>State:</label>
                    <input
                        type="text"
                        name="state"
                        value={editableUserData?.address?.state || ''}
                        onChange={handleAddressChange}
                        placeholder="State"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label>Country:</label>
                    <input
                        type="text"
                        name="country"
                        value={editableUserData?.address?.country || ''}
                        onChange={handleAddressChange}
                        placeholder="Country"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label>Zip Code:</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={editableUserData?.address?.zipCode || ''}
                        onChange={handleAddressChange}
                        placeholder="Zip Code"
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Address</button>
            </form>
        </div>
    );
};

export default checkAuth(Profile);
