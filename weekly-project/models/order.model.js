const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userEmail: { 
        type: String,
        required: true
    },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    total: {
        type: Number,
        required: true
    },
    paymentIntentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'}
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
