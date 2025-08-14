// routes/marketplace.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAllProducts, getProductById } = require('../controllers/marketplaceController');

// All marketplace routes are protected to ensure we know who the user is
router.get('/products', auth, getAllProducts);
router.get('/products/:id', auth, getProductById);

module.exports = router;