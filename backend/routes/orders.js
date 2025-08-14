// routes/orders.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createOrder, getPlacedOrders, getReceivedOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', auth, createOrder);
router.get('/placed', auth, getPlacedOrders);
router.get('/received', auth, getReceivedOrders);
router.put('/received/:id', auth, updateOrderStatus);

module.exports = router;