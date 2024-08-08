const mongoose = require('mongoose');

// สร้าง Schema สำหรับคำสั่งซื้อ
const OrderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true},
    quantity: {
        type: Number,
        required: true,
        min: 1 },
    totalPrice: {
        type: Number,
        required: true},}
        
    ,{timestamps: true
    });
        

module.exports = mongoose.model('Order', OrderSchema);


