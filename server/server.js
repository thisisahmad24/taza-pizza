import express from 'express';
import bcrypt from 'bcrypt';
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

// --- Admin Routes ---

// Get All Orders (for Admin Dashboard)
app.get('/api/admin/orders', async (req, res) => {
  try {
    // Sort by newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status
app.put('/api/admin/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Auth Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    
    // Return user without password
    const userToReturn = { _id: savedUser._id, name: savedUser.name, email: savedUser.email };
    res.status(201).json(userToReturn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const userToReturn = { _id: user._id, name: user.name, email: user.email };
    res.json(userToReturn);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile
app.put('/api/auth/profile', async (req, res) => {
  try {
    const { userId, name, email, newPassword } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if new email is already taken by another user
    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({ error: 'Email is already in use.' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await user.save();
    const userToReturn = { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email };
    
    res.json(userToReturn);
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

// --- Reviews Routes ---

// Create Review/Feedback
app.post('/api/reviews', async (req, res) => {
  try {
    const { userId, orderId, rating, comment } = req.body;
    if (!orderId || !rating) {
      return res.status(400).json({ error: 'Order ID and rating are required.' });
    }
    const newReview = new Review({ userId: userId || undefined, orderId, rating, comment });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().populate('userId', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
