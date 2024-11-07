// Importing required packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const wishListRoute = require('./routes/wishListRoute')
const cookieParser = require('cookie-parser');

// Initialize dotenv for environment variables
dotenv.config();

// Create an instance of Express
const app = express();

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend origin
    credentials: true,               // Allow cookies and credentials
    optionsSuccessStatus: 200,       // Some legacy browsers choke on 204
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers if needed
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] // Allow all necessary methods
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser());

// Connect to MongoDB
connectDB()

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishListRoute);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
