// controllers/inventoryController.js
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');

// GET /api/inventory/my-products
exports.getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ ownerId: req.user.id });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// POST /api/inventory/my-products
exports.addProduct = async (req, res) => {
    const { name, stock_quantity, price, category } = req.body;
    try {
        const newProduct = new Product({
            name,
            stock_quantity,
            price,
            category,
            ownerId: req.user.id
        });
        const product = await newProduct.save();

        // Log the initial stock entrance
        const log = new InventoryLog({
            product: product._id,
            user: req.user.id,
            type: 'Entrance',
            quantity_change: stock_quantity
        });
        await log.save();
        
        res.status(201).json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// PUT /api/inventory/my-products/:id
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.ownerId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // Manually log stock increase if stock_quantity is being updated
        const oldStock = product.stock_quantity;
        const newStock = req.body.stock_quantity;
        if (newStock && newStock > oldStock) {
             const log = new InventoryLog({
                product: product._id,
                user: req.user.id,
                type: 'Entrance',
                quantity_change: newStock - oldStock
            });
            await log.save();
        }

        product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// DELETE /api/inventory/my-products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.ownerId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Product.findByIdAndRemove(req.params.id);
        // Also remove related inventory logs if desired
        await InventoryLog.deleteMany({ product: req.params.id });
        
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};