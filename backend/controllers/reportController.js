// controllers/reportController.js
const Order = require('../models/Order');
const InventoryLog = require('../models/InventoryLog');
const Product = require('../models/Product');

// GET /api/reports/my-sales
exports.getMySales = async (req, res) => {
    try {
        const sales = await Order.find({ seller: req.user.id, status: { $ne: 'Canceled' } });
        const totalSales = sales.reduce((acc, order) => acc + order.totalAmount, 0);
        res.json({ totalSales, salesDetails: sales });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// GET /api/reports/my-inventory-history
exports.getMyInventoryHistory = async (req, res) => {
    try {
        const history = await InventoryLog.find({ user: req.user.id }).populate('product', 'name').sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// GET /api/reports/my-low-stock
exports.getLowStockAlerts = async (req, res) => {
    try {
        const lowStockProducts = await Product.find({
            ownerId: req.user.id,
            stock_quantity: { $lt: 5 }
        });
        res.json(lowStockProducts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};