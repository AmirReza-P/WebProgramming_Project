// routes/inventory.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getMyProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/inventoryController');

// All these routes are protected
router.get('/my-products', auth, getMyProducts);
router.post('/my-products', auth, addProduct);
router.put('/my-products/:id', auth, updateProduct);
router.delete('/my-products/:id', auth, deleteProduct);

module.exports = router;