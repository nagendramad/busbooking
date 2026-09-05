const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../shared/models');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Email/Phone Registration
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      name,
      phone,
      email,
      passwordHash,
      otp,
      otpExpiry
    });

    await user.save();

    // Send OTP via SMS/Email (mock)
    console.log(`OTP sent: ${otp}`);

    res.status(201).json({ message: 'Registration successful. Please verify OTP.', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// OTP Verification
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, email, otp } = req.body;
    const query = phone ? { phone } : { email };
    
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({ message: 'Verification successful', token, userType: user.userType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    const query = phone ? { phone } : { email };
    
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your account first' });
    }

    const token = generateToken(user._id);
    res.json({ token, userType: user.userType, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { phone, email } = req.body;
    const query = phone ? { phone } : { email };
    
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`Password reset OTP: ${otp}`);
    res.json({ message: 'OTP sent for password reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, email, otp, newPassword } = req.body;
    const query = phone ? { phone } : { email };
    
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;