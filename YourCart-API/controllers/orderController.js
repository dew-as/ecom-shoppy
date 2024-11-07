const Order = require('../models/Order');
const Cart = require('../models/Cart');
const stripe = require('stripe')('sk_test_51ODOSXSATEh2zQJx3BCA9gaKqKDTNfwWQhHnU2nwyvOPKpUEdmzixplUdBEs9AMEKonaiYp0hwkbTExCKVZ94X3200oW5hJknk');

// Place an order
const placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

        const order = new Order({
            user: req.user._id,
            products: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity
            })),
            totalAmount: cart.items.reduce((total, item) => total + item.productId.price * item.quantity, 0)
        });

        await order.save();
        await cart.deleteOne(); // Clear the cart
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders for admin
const getOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('products.productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an order by ID
const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ _id: orderId, user: req.user._id }).populate('products.productId');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel an order by ID
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order and verify if it belongs to the user
        const order = await Order.findOne({ _id: orderId, user: req.user._id });
        console.log(order);
        

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order is already canceled or completed
        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        // Update the order status to 'Cancelled'
        order.status = 'Cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel an order by ID
const cancelOrderAdmin = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order and verify if it belongs to the user
        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order is already canceled or completed
        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        // Update the order status to 'Cancelled'
        order.status = 'Cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Confirm an order by ID (Admin only)
const confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status to 'Confirmed'
        order.status = 'Confirmed';
        await order.save();

        res.json({ message: 'Order confirmed successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Payment session creation route
const createPaymentSession = async (req, res) => {
    const { orderId, amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'aed',
                        product_data: {
                            name: 'Order Payment',
                            description: `Order ID: ${orderId}`,
                        },
                        unit_amount: Math.round(amount * 100), // Convert amount to cents and ensure it's an integer
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/orders?status=success`,
            cancel_url: `http://localhost:3000/orders?status=cancelled`,
        });

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status to 'Payment Verifying'
        order.status = 'Payment Verifying';
        await order.save();
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ message: 'Failed to create payment session' });
    }
};



module.exports = { placeOrder, getOrders, getOrder, cancelOrder, confirmOrder, getOrdersAdmin, cancelOrderAdmin, createPaymentSession };
