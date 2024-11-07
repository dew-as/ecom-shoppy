// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/User/Register';
import Login from './components/User/Login';
import Profile from './components/User/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import ProductsList from './components/Product/ProductList';
import ProductDetails from './components/Product/ProductDetails';
import ErrorPage from './components/ErrorPage';
import { useDispatch } from 'react-redux';
import { login, logout, fetchUserProfile } from './redux/slices/authSlice';
import axiosConfig from './api/axiosConfig';
import Orders from './components/Order/Orders';
import AdminDashboard from './components/Admin/AdminDashBoard';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import OrderManagement from './components/Admin/OrderManagement';
import AddProduct from './components/Admin/AddProduct';
import OrderSuccess from './components/Order/OrderSuccess';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fullUrl = window.location.pathname;
        const urls = ['/login', '/register', '/about'];
        const isAuth = async () => {
            try {
                const result = await axiosConfig.get('users/check');
                if (result.status === 200) {
                    // Dispatch login action
                    await dispatch(login({ _id: result.data._id }));
                    // Dispatch fetchUserProfile to get user data
                    await dispatch(fetchUserProfile());
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    dispatch(logout());
                }
            }
        };

        const current = urls.includes(fullUrl);
        if (!current) {
            isAuth();
        }
    }, [dispatch]);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<ProductsList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/orders" element={<Orders />} />
                <Route path='/orderSuccess' element={<OrderSuccess />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/addProduct" element={<AddProduct />} />

                {/* Common Error Routes */}
                <Route path="/error/:code" element={<ErrorPage />} />

                {/* Fallback route for unmatched paths */}
                <Route path="*" element={<Navigate to="/error/404" replace />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
