const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// BUG-01 FIX: only 'customer' and 'restaurant' allowed — 'admin' must be seeded directly in DB
const ALLOWED_REGISTER_ROLES = ['customer', 'restaurant'];

const register = async (req, res) => {
  const { username, email, password, phone } = req.body;
  const role = ALLOWED_REGISTER_ROLES.includes(req.body.role) ? req.body.role : 'customer';

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email and password are required' });
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ username, email, password, phone, role });
  const token = signToken(user._id);

  res.status(201).json({
    token,
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    phone: user.phone,
  });
};

const login = async (req, res) => {
  const { email, username, password } = req.body;

  if (!password || (!email && !username)) {
    return res.status(400).json({ message: 'email/username and password are required' });
  }

  const query = email ? { email } : { username };
  const user = await User.findOne(query);

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user._id);
  res.json({
    token,
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    phone: user.phone,
    addresses: user.addresses,
  });
};

const getMe = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  const { username, phone, addresses } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (username) user.username = username;
  // FE-06 FIX: allow clearing phone (send null/empty string to remove it)
  if (phone !== undefined) user.phone = phone || undefined;
  if (Array.isArray(addresses)) user.addresses = addresses;

  // BUG-05 FIX: catch duplicate username (E11000) and return 400 instead of crashing
  try {
    await user.save();
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    throw err;
  }

  // BUG-02 FIX: re-fetch without password field to avoid leaking hash
  const updated = await User.findById(req.user._id).select('-password');
  res.json(updated);
};

// PUT /api/auth/change-password  (protected)
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: 'Both current and new password are required' });
  if (newPassword.length < 6)
    return res.status(400).json({ message: 'New password must be at least 6 characters' });

  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword)))
    return res.status(401).json({ message: 'Current password is incorrect' });

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed successfully' });
};

// POST /api/auth/forgot-password  (public)
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  const generic = { message: 'If that email is registered you will receive a reset link shortly.' };

  if (!user) return res.json(generic);

  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `FoodieHub <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'FoodieHub — Password Reset Request',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#e85d04">FoodieHub</h2>
          <p>Hi <strong>${user.username}</strong>,</p>
          <p>We received a request to reset your password. Click the button below — the link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#e85d04;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">
            Reset Password
          </a>
          <p style="color:#888;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
          <p style="color:#888;font-size:12px">Or copy this link: ${resetUrl}</p>
        </div>
      `,
    });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
  }

  res.json(generic);
};

// POST /api/auth/reset-password  (public)
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ message: 'Token and new password are required' });
  if (newPassword.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired reset link' });

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successfully. You can now log in.' });
};

module.exports = { register, login, getMe, updateProfile, changePassword, forgotPassword, resetPassword };
