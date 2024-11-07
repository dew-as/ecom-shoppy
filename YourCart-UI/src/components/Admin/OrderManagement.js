import React, { useEffect, useState } from 'react';
import axiosConfig from '../../api/axiosConfig';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Call the endpoint that retrieves all orders for admin
                const response = await axiosConfig.get('orders/admin/orders'); // Adjust the URL if necessary
                console.log(response.data); // Log the response data
                setOrders(response.data); // Set the orders in the state
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array ensures this runs once on component mount

    const handleConfirmOrder = async (orderId) => {
        try {
            await axiosConfig.put(`orders/confirm/${orderId}`, {});
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: 'Confirmed' } : order
            ));
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await axiosConfig.put(`orders/cancel/${orderId}`);
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: 'Canceled' } : order
            ));
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Order Management</h2>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>User</th>
                        <th>Products</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order.user}</td>
                            <td>{order.products.map(p => p.productId.title).join(', ')}</td>
                            <td>{order.status}</td>
                            <td>
                                <button className="btn btn-success" onClick={() => handleConfirmOrder(order._id)}>Confirm</button>
                                <button className="btn btn-danger ml-2" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderManagement;
