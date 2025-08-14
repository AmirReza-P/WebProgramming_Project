// routes/reports.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getMySales, getMyInventoryHistory, getLowStockAlerts } = require('../controllers/reportController');

router.get('/my-sales', auth, getMySales);
router.get('/my-inventory-history', auth, getMyInventoryHistory);
router.get('/my-low-stock', auth, getLowStockAlerts);

module.exports = router;