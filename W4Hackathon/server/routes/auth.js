const express = require('express');
const router = express.Router();
const User = require('../models/Users'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/signup', async (req, res) => {
  try {
    // 1. Extract all fields from the frontend request
    const { 
      name, email, password, 
      subscriptionPlan, billingCycle, 
      cardNumber, expiry, cvv 
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // 2. Hash the password correctly
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Defined here

    // 3. Create the user with nested dummy payment info
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, // Matches the variable above
      subscriptionPlan: subscriptionPlan || 'Basic Plan',
      billingCycle: billingCycle || 'monthly',
      paymentInfo: { 
        cardNumber: cardNumber || '0000 0000 0000 0000', 
        expiry: expiry || '12/26', 
        cvv: cvv || '000' 
      }
    });

    await user.save();

    // 4. Generate token for immediate login
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      token, 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        subscriptionPlan: user.subscriptionPlan 
      } 
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// --- LOGIN (Stays largely the same, but consistent) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.status === 'blocked') return res.status(403).json({ message: "Account suspended" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      token, 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        subscriptionPlan: user.subscriptionPlan 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- SUBSCRIBE (For existing users upgrading their plan) ---
router.put('/:id/subscribe', async (req, res) => {
  try {
    const { plan, billingCycle } = req.body;

    const expiryDate = new Date();
    if (billingCycle === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { subscriptionPlan: plan, subscriptionExpiry: expiryDate }, 
      { new: true }
    ).select('-password');

    // Return the updated user object directly so Zustand can sync it
    res.status(200).json({ 
      message: "Plan activated!", 
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscriptionPlan: updatedUser.subscriptionPlan
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Subscription failed" });
  }
});
// --- GET ALL USERS (For Admin Management) ---
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't send passwords to frontend
    res.json(users);
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ message: "Could not fetch user directory" });
  }
});

// --- TOGGLE USER STATUS (Block/Unblock) ---
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: "Failed to update user status" });
  }
});
module.exports = router;