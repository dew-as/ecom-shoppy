import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../../api/axiosConfig';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
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
            await axiosConfig.post('/users/register', formData);
            navigate('/login'); // Redirect to login after successful registration
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setErrorMessage("Email Already Taken");
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
                <h2 className="mb-3">Register</h2>
                {errorMessage && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {errorMessage}
                        <button type="button" className="btn-close" aria-label="Close" onClick={() => setErrorMessage('')}></button>
                    </div>
                )}
                <div className="mb-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <div className="mb-3">
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
