const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, phone });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


// User login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'No user found !' });
        }
        if ((await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // Send the token as an HTTP-only cookie
            res.cookie('authToken', token, {
                httpOnly: true,    // Prevents JavaScript access
                secure: process.env.NODE_ENV === 'production',  // Use true in production to ensure HTTPS
                maxAge: 24 * 60 * 60 * 1000,  // Cookie expiry (1 day in milliseconds)
                sameSite: 'strict' // Helps mitigate CSRF attacks
            });

            // Send a response confirming the login
            res.status(200).json({ message: 'Login successful', isAuth: true, _id: user._id });
        } else {
            res.status(401).json({ message: 'Invalid Password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart wishlist orders');
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const logout = (req, res) => {
    try {
        // Clear the authentication token (usually stored in cookies or on client-side storage)
        res.clearCookie('authToken');  // This is if you're using cookies to store the JWT

        res.json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Add Address Controller
const addAddress = async (req, res) => {
    try {
        const { street, city, state, country, zipCode } = req.body;
        // Update the user's address
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { address: { street, city, state, country, zipCode } },
            { new: true, runValidators: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Address added successfully', address: updatedUser.address });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// controllers/authController.js
const checkAuthStatus = (req, res) => {
    // Since the authMiddleware already verified the token, this route confirms the user is authenticated
    res.status(200).json({ message: 'User is authenticated', _id: req.user._id });
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific user's profile by ID (Admin only)
const getUserProfileAdminOnly = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('orders');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { registerUser, loginUser, getUserProfile, logout, addAddress, checkAuthStatus, getAllUsers, getUserProfileAdminOnly, deleteUser };
