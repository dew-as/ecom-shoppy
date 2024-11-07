const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishListController');
const { authenticate } = require('../middlewares/authMiddleware');

// Routes
router.get('/', authenticate, getWishlist);               // Get user's wishlist
router.post('/add', authenticate, addToWishlist);         // Add product to wishlist
router.delete('/remove/:productId', authenticate, removeFromWishlist); // Remove product from wishlist

module.exports = router;
