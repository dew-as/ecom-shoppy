const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, logout, addAddress, checkAuthStatus, getAllUsers, getUserProfileAdminOnly, deleteUser } = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');

// Routes
router.post('/register', registerUser); // User registration
router.post('/login', loginUser);       // User login
router.get('/profile', authenticate, getUserProfile); // Get profile (protected)
router.post('/logout', authenticate, logout); // Logout route (protected if desired)
router.post('/addAddress', authenticate, addAddress); // Add address route (protected)
router.get('/check', authenticate, checkAuthStatus);
// Routes
router.get('/', authenticate, authorizeAdmin, getAllUsers);      // Admin get all users
router.get('/:userId', authenticate, authorizeAdmin, getUserProfileAdminOnly); // Admin get user profile
router.delete('/delete/:userId', authenticate, authorizeAdmin, deleteUser)

module.exports = router;