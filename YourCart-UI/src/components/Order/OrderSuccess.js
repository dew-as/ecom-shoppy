import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Start a timer to update the countdown every second
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // Navigate to home when countdown reaches 0 and clear the timer
        if (countdown === 0) {
            navigate('/');
        }

        // Clear the timer if the component unmounts
        return () => clearInterval(timer);
    }, [countdown, navigate]);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
            <h1 className="text-success mb-3">Order Placed Successfully!</h1>
            <p className="text-muted">Redirecting to the homepage in {countdown} seconds...</p>
        </div>
    );
};

export default OrderSuccess;
