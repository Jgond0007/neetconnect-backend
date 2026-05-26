const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, targetYear, subject, neetScore } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashed, role, targetYear, subject, neetScore,
      status: role === 'mentor' ? 'pending' : 'active'
    });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, status: user.status } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.status === 'banned') return res.status(403).json({ message: 'Account banned' });
    if (user.status === 'pending') return res.status(403).json({ message: 'Account pending approval' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;