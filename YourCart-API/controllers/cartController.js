const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
        res.json(cart || { items: [] });
        console.log(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Find the product to get the price
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            // Create a new cart with the item, setting the total price based on quantity
            cart = new Cart({
                user: req.user._id,
                items: [{ productId, quantity, price: product.price * quantity }]
            });
        } else {
            // Check if the item already exists in the cart
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
            if (itemIndex > -1) {
                // If item exists, update the quantity and calculate total price
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].price = product.price * cart.items[itemIndex].quantity; // Total price calculation
            } else {
                // If item does not exist, add it with the total price
                cart.items.push({ productId, quantity, price: product.price * quantity });
            }
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the item to remove
        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.json({ message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Decrease quantity of item in cart
const decreaseCartItemQuantity = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart, decreaseCartItemQuantity };
