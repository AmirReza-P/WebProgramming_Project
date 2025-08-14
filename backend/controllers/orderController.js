// controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');

// POST /api/orders
exports.createOrder = async (req, res) => {
    // ... (This function remains the same, no changes needed here)
    const { cartItems } = req.body;

    try {
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }
        const firstProduct = await Product.findById(cartItems[0].productId);
        if (!firstProduct) return res.status(404).json({ msg: 'Product not found' });
        const sellerId = firstProduct.ownerId;
        let totalAmount = 0;
        const orderProducts = [];

        for (const item of cartItems) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ msg: `Product with ID ${item.productId} not found` });
            if (product.stock_quantity < item.quantity) return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
            
            product.stock_quantity -= item.quantity;
            await product.save();

            const log = new InventoryLog({
                product: product._id,
                user: sellerId,
                type: 'Exit',
                quantity_change: -item.quantity
            });
            await log.save();

            orderProducts.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price
            });
            totalAmount += item.quantity * product.price;
        }

        const newOrder = new Order({
            buyer: req.user.id,
            seller: sellerId,
            products: orderProducts,
            totalAmount
        });

        const order = await newOrder.save();
        res.status(201).json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// GET /api/orders/placed (Orders I've Bought)
exports.getPlacedOrders = async (req, res) => {
    // ... (This function remains the same, no changes needed here)
    try {
        const orders = await Order.find({ buyer: req.user.id }).populate('seller', 'username').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// GET /api/orders/received (Orders I've Sold)
exports.getReceivedOrders = async (req, res) => {
    // ... (This function remains the same, no changes needed here)
    try {
        const orders = await Order.find({ seller: req.user.id }).populate('buyer', 'username').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// PUT /api/orders/received/:id (Update order status)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        if (order.seller.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const newStatus = req.body.status;
        const oldStatus = order.status;

        // *** NEW LOGIC STARTS HERE ***
        // If the order is being canceled and it wasn't already canceled
        if (newStatus === 'Canceled' && oldStatus !== 'Canceled') {
            // Loop through each product in the order and restock it
            for (const item of order.products) {
                // Use $inc to safely increment the stock quantity
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock_quantity: item.quantity } });
                
                // Create an inventory log to record the restock (Entrance)
                const log = new InventoryLog({
                    product: item.productId,
                    user: req.user.id, // The seller is the one managing the inventory
                    type: 'Entrance',
                    quantity_change: item.quantity,
                    reason: `Canceled Order #${order._id}` // Optional: add a reason for auditing
                });
                await log.save();
            }
        }
        // *** NEW LOGIC ENDS HERE ***

        order.status = newStatus;
        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};