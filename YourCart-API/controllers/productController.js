const Product = require('../models/Product');

// Get all products with pagination
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query; // Default to page 1 and 20 items per page
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 }, // Sort by newest first, optional
        };

        const products = await Product.paginate({}, options);
        res.json({
            products: products.docs,
            total: products.totalDocs,
            pageCount: products.totalPages,
            currentPage: products.page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a product by ID
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new product
const addProduct = async (req, res) => {
    try {
        const productData = req.body;

        // Convert uploaded images to buffer strings
        if (req.files && req.files.images) {
            productData.images = req.files.images.map((file) => 'data:image/jpeg;base64,' + file.buffer.toString('base64'));
        }

        // Convert thumbnail to buffer string
        if (req.files && req.files.thumbnail) {
            productData.thumbnail = 'data:image/jpeg;base64,' + req.files.thumbnail[0].buffer.toString('base64');
        }

        const product = new Product(productData);
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Error adding product:', error);  // Detailed log
        res.status(500).json({ message: "Failed to add product. Please try again." });  // User-friendly message
    }
};


// Update a product by ID
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProduct, addProduct, updateProduct, deleteProduct };