const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrder, cancelOrder, confirmOrder, getOrdersAdmin, cancelOrderAdmin, createPaymentSession } = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Routes
router.post('/', authenticate, placeOrder); // Place an order
router.get('/', authenticate, getOrders);   // Get all user orders
router.get('/:orderId', authenticate, getOrder); // Get a specific order by ID
router.put('/cancel/:orderId', authenticate, cancelOrderAdmin); // Cancel an order by ID
router.put('/cancelUser/:orderId', authenticate, cancelOrder); // Cancel an order by ID
router.put('/confirm/:orderId', authenticate, authorizeAdmin, confirmOrder); // Confirm an order (Admin only)
// Admin route to get all orders
router.get('/admin/orders', authenticate, authorizeAdmin, getOrdersAdmin);
router.post('/payments/create-payment-session', authenticate, createPaymentSession);


module.exports = router;
