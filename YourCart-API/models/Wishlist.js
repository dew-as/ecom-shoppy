const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    products: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } // List of product references
    ]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
