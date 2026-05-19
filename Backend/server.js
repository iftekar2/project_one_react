const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Move your models to the top level! If the path is wrong, 
// the server will crash immediately upon startup and tell us exactly why.
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const app = express();

// 2. Middleware
app.use(cors()); 
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 3. Clean, simplified routes
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("❌ Database Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const newOrder = new Order({ items, totalAmount });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Database Save Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));