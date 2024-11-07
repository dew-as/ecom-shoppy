const express = require('express');
const router = express.Router();
const { getProducts, getProduct, addProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get('/', getProducts);               // Get all products with pagination
router.get('/:id', getProduct);             // Get a single product by ID
router.post(
    '/',
    authenticate,
    authorizeAdmin,
    upload.fields([{ name: 'images', maxCount: 5 }, { name: 'thumbnail', maxCount: 1 }]),
    addProduct
);  // Add a new product (Admin only)
router.put('/:id', authenticate, authorizeAdmin, updateProduct); // Update a product (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct); // Delete a product (Admin only)

module.exports = router;
