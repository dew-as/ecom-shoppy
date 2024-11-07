import React, { useState } from 'react';
import axiosConfig from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser, login } from '../../redux/slices/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosConfig.post('/users/login', formData);
            if (res.data.isAuth) {
                dispatch(login({ _id: res.data._id })); // Dispatch the login action to update Redux state
                navigate('/'); // Redirect to home after successful login
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage(error.response.data.message);
                } else if (error.response.status === 500) {
                    setErrorMessage("Server error. Please try again later.");
                } else {
                    setErrorMessage("An unexpected error occurred.");
                }
            } else {
                setErrorMessage("Network error. Please check your internet connection.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit} className="border p-4 rounded">
                <h2 className="mb-3">Login</h2>
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
                <div className="mb-3">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
