// src/components/ErrorPage.js
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const { code } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Error {code}</h1>
            <p>{location.state?.message || 'An unexpected error occurred.'}</p>
            <button onClick={() => navigate('/')}>Go Home</button>
        </div>
    );
};

export default ErrorPage;
