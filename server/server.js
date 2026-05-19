import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { User } from './models/User.js';
import { Pizza } from './models/Pizza.js';
import { Order } from './models/Order.js';
import { Review } from './models/Review.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taza-pizza';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Basic Routes ---

// Get Pizzas
app.get('/api/pizzas', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Machine Learning Prediction & Suggestion Routes ---

// 1. Predict Delivery ETA
app.get('/api/predict/eta', (req, res) => {
  const { distance, weather_delay, num_pizzas, is_rush_hour, day_of_week } = req.query;

  // Validate inputs
  if (!distance || !weather_delay || !num_pizzas || is_rush_hour === undefined || day_of_week === undefined) {
    return res.status(400).json({ error: 'Missing required query parameters: distance, weather_delay, num_pizzas, is_rush_hour, day_of_week' });
  }

  const cmd = `python server/ml/predict.py eta --distance ${parseFloat(distance)} --weather ${parseFloat(weather_delay)} --pizzas ${parseInt(num_pizzas)} --rush ${parseInt(is_rush_hour)} --day ${parseInt(day_of_week)}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('ETA Prediction execution error:', error);
      return res.status(500).json({ error: 'Failed to execute ETA prediction model', details: stderr });
    }
    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseErr) {
      res.status(500).json({ error: 'Failed to parse prediction model output', stdout });
    }
  });
});

// 2. Suggest Pizzas (Collaborative & Content-based)
app.get('/api/predict/suggest', (req, res) => {
  const { user_id, keywords } = req.query;

  let cmd = `python server/ml/predict.py suggest`;
  if (user_id) cmd += ` --user ${parseInt(user_id)}`;
  if (keywords) cmd += ` --keywords "${keywords.replace(/"/g, '\\"')}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Suggestion execution error:', error);
      return res.status(500).json({ error: 'Failed to execute Suggestion model', details: stderr });
    }
    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseErr) {
      res.status(500).json({ error: 'Failed to parse suggestion model output', stdout });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
