import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest checkout
  items: [{
    pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Preparing', 'Baking', 'Out for Delivery', 'Delivered'], default: 'Preparing' },
  estimatedDelivery: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
