const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  //Check if user exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });
// return false;
  try {
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log(token);
  res.json({ token, username: user.username });
});

// Dashboard - list all users (protected)
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ isDeleted: 0 }, '-password'); // filter by isDeleted = 0, exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user by ID (add in routes/auth.js)
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: 1 },  // Soft delete by setting isDeleted to 1
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User marked as deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// UPDATE user by ID (add in routes/auth.js)
router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { username: req.body.username, email: req.body.email },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
