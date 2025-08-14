// models/InventoryLog.js
const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String,
        enum: ['Entrance', 'Exit'], // Entrance = stock added, Exit = stock removed (sold)
        required: true 
    },
    quantity_change: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InventoryLog', InventoryLogSchema);