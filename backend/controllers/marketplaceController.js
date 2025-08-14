// controllers/marketplaceController.js
const Product = require('../models/Product');

// GET /api/marketplace/products
exports.getAllProducts = async (req, res) => {
    try {
        // Find all products NOT owned by the current user
        const products = await Product.find({ ownerId: { $ne: req.user.id } });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// GET /api/marketplace/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('ownerId', 'username email');
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};