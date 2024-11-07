// Error handling middleware
const errorMiddleware = (err, req, res, next) => {
    // Set default status code and message
    let statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Log the error (you can customize this part to log to a file or monitoring service)
    console.error('Error:', err);

    // Send error response
    res.status(statusCode).json({
        success: false,
        message: message,
        // Optionally include stack trace in development mode
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorMiddleware;
