const jwt = require('jsonwebtoken');
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

module.exports = { register, login, getMe, updateProfile };
