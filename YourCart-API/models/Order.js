const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
    totalAmount: { type: Number, required: true }, // Total cost of the order
    status: { type: String, default: 'Pending' } // Order status (Pending, Shipped, etc.)
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
