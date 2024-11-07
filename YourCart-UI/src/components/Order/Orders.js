import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { fetchOrders, cancelOrder } from '../../redux/slices/orderSlice';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosConfig from '../../api/axiosConfig';

const pk_Key = process.env.REACT_APP_STRIPE_PUBLIC_KEY

const stripePromise = loadStripe('pk_test_51ODOSXSATEh2zQJxiahc7DZU92SDBh61R1QsnX9Csi5mwjLEvxr1MbCbPqykX0G7Zb1bXP6LNIjfKsmHsguRMx7500rcQnCPRq');

const Orders = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.items);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchOrders());

        // Check if the URL has a status=success parameter and redirect to /orderSuccess
        const params = new URLSearchParams(location.search);
        if (params.get('status') === 'success') {
            navigate('/orderSuccess');
        }
    }, [dispatch, location, navigate]);

    const handlePayment = async (orderId, amount) => {
        try {
            const response = await axiosConfig.post('orders/payments/create-payment-session', { orderId, amount });
            const { id } = response.data;
            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: id });
        } catch (error) {
            console.error('Error initiating payment:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Your Orders</h2>
            {!user.address ? (
                <div className="alert alert-warning">
                    Your address is not set. Please update your address in your profile.{' '}
                    <Link to="/profile">Go to Profile</Link>
                </div>
            ) : null}

            {orders.length > 0 ? (
                orders.map((order) => (
                    <Card key={order._id} className="mb-4">
                        <Card.Header as="h5">Order ID: {order._id}</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <strong>Status:</strong> {order.status}
                                </Col>
                                <Col>
                                    <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
                                </Col>
                            </Row>

                            {/* Delivery Address Section */}
                            <div className="mt-3 p-3 border rounded bg-light">
                                <h6>Delivery Address</h6>
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Street:</strong> {user?.address?.street}</p>
                                <p><strong>City:</strong> {user?.address?.city}</p>
                                <p><strong>State:</strong> {user?.address?.state}</p>
                                <p><strong>Country:</strong> {user?.address?.country}</p>
                                <p><strong>Zip Code:</strong> {user?.address?.zipCode}</p>
                                <p><strong>Phone:</strong> {user.phone}</p>
                            </div>

                            {/* Products List */}
                            <ul className="list-group list-group-flush mt-3">
                                {order.products.map((item) => (
                                    <li key={item.productId._id} className="list-group-item">
                                        {item.productId.title} - Quantity: {item.quantity}
                                    </li>
                                ))}
                            </ul>

                            {/* Action Buttons */}
                            <div className="d-flex justify-content-between mt-3">
                                <Button
                                    variant="danger"
                                    onClick={async () => await dispatch(cancelOrder(order._id)) && dispatch(fetchOrders())}
                                    disabled={order.status === 'Cancelled' || order.status === 'Confirmed'}
                                >
                                    Cancel Order
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => handlePayment(order._id, order.totalAmount)}
                                    disabled={!user.address || order.status !== 'Pending'}
                                >
                                    {order.status === 'Pending' ? 'Make Payment' : 'Payment Done'}
                                </Button>
                            </div>
                            {order.status === 'Payment Verifying' && (
                                <div className="text-success mt-3">Payment done, waiting for confirmation</div>
                            )}
                            {order.status === 'Confirmed' && (
                                <div className="text-success mt-3">Your Order will be Delivered in 3 to 7 Days</div>
                            )}
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default Orders;
