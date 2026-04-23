const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    street: String,
    city: String,
    zip: String,
  },
  contactPhone: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for performance optimization
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ item: 1 });

module.exports = mongoose.model('Order', orderSchema);
