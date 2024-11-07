import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center">Admin Dashboard</h1>
            <nav>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link to="/admin/users" className="nav-link">Manage Users</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/products" className="nav-link">Manage Products</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/admin/orders" className="nav-link">Manage Orders</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminDashboard;
