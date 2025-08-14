// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    stock_quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Creates a reference to the User model
        required: true 
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);