// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate the user using JWT
const authenticate = async (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); // Find the user by ID in the token
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to authorize only admins
const authorizeAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next(); // Proceed if user is an admin
};

module.exports = { authenticate, authorizeAdmin };