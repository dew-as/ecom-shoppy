const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, decreaseCartItemQuantity } = require('../controllers/cartController');
const { authenticate } = require('../middlewares/authMiddleware');

// Routes
router.get('/', authenticate, getCart);         // Get user's cart
router.post('/add', authenticate, addToCart);   // Add to cart
router.delete('/remove/:productId', authenticate, removeFromCart); // Remove item from cart
router.patch('/decrease', authenticate, decreaseCartItemQuantity); // Decrease quantity of an item in cart

module.exports = router;
