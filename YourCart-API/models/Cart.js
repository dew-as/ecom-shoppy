const { default: mongoose } = require("mongoose");

// Cart model (cartSchema)
const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1 },
            price: { type: Number, default: 0 } // Store product price
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;