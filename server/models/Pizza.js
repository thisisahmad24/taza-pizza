import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String }],
  basePrice: { type: Number, required: true },
  isAiGenerated: { type: Boolean, default: false },
  imageUrl: { type: String }, // For Unsplash images
  createdAt: { type: Date, default: Date.now }
});

export const Pizza = mongoose.model('Pizza', pizzaSchema);
