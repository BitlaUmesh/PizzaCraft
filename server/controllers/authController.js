const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

const generateJWT = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password });

    // Generate email verification token (24hr)
    try {
      const token = crypto.randomBytes(32).toString('hex');
      await Token.create({
        userId: user._id,
        token,
        type: 'email_verification',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      await sendVerificationEmail(user, token);
    } catch (emailErr) {
      console.error('Email verification setup failed (non-fatal):', emailErr.message);
      // Auto-verify in dev mode if email fails
      if (process.env.NODE_ENV === 'development') {
        await User.findByIdAndUpdate(user._id, { isEmailVerified: true });
      }
    }

    res.status(201).json({
      success: true,
      message: process.env.NODE_ENV === 'development'
        ? 'Registered successfully! You can now login.'
        : 'Registered! Check your email to verify your account.',
    });
  } catch (error) {
    console.error('register error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// GET /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
  try {
    const tokenDoc = await Token.findOne({
      token: req.params.token,
      type: 'email_verification',
    });

    if (!tokenDoc)
      return res.status(400).json({ success: false, message: 'Invalid or expired verification link' });

    await User.findByIdAndUpdate(tokenDoc.userId, { isEmailVerified: true });
    await Token.deleteOne({ _id: tokenDoc._id });

    res.json({ success: true, message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    console.error('verifyEmail error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isEmailVerified)
      return res.status(401).json({ success: false, message: 'Please verify your email first' });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: generateJWT(user._id),
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error('login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user)
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    // Remove any existing reset tokens
    await Token.deleteMany({ userId: user._id, type: 'password_reset' });

    const token = crypto.randomBytes(32).toString('hex');
    await Token.create({
      userId: user._id,
      token,
      type: 'password_reset',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    await sendPasswordResetEmail(user, token);
    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('forgotPassword error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const tokenDoc = await Token.findOne({
      token: req.params.token,
      type: 'password_reset',
    });

    if (!tokenDoc)
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link' });

    const user = await User.findById(tokenDoc.userId);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    user.password = password;
    await user.save();
    await Token.deleteOne({ _id: tokenDoc._id });

    res.json({ success: true, message: 'Password reset successful! You can now login.' });
  } catch (error) {
    console.error('resetPassword error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

module.exports = { register, verifyEmail, login, forgotPassword, resetPassword, getMe };
