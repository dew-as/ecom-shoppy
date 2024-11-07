const Wishlist = require('../models/Wishlist')

// Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
        res.json(wishlist);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Add a product to the wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        // Check if wishlist exists, create one if not
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [productId] });
        } else {
            // Check if product is already in the wishlist
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }
            wishlist.products.push(productId);
        }

        await wishlist.save();
        res.status(201).json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Remove a product from the wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

        const productIndex = wishlist.products.indexOf(productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        wishlist.products.splice(productIndex, 1); // Remove product from wishlist
        await wishlist.save();
        res.json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
