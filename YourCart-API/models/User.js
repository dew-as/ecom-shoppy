const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zipCode: { type: String }
    },
    isAdmin: { type: Boolean, default: false },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Reference to Cart model
    wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' }, // Reference to Wishlist model
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] // Array of Order references
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;