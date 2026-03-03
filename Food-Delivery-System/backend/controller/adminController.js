const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Review = require('../models/Review');

// GET /api/admin/stats
const getStats = async (req, res) => {
  const [users, restaurants, orders, reviews] = await Promise.all([
    User.countDocuments(),
    Restaurant.countDocuments(),
    Order.countDocuments(),
    Review.countDocuments(),
  ]);

  const [revenue, activeOrders] = await Promise.all([
    Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'preparing', 'out_for_delivery'] } }),
  ]);

  res.json({
    users,
    restaurants,
    orders,
    reviews,
    revenue: revenue[0]?.total || 0,
    activeOrders,
  });
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const role = req.query.role;
  const search = req.query.search;

  const query = {};
  if (role) query.role = role;
  if (search) query.$or = [
    { username: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.json({ total, page, limit, pages: Math.ceil(total / limit), data: users });
};

// PATCH /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'restaurant', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot change your own role' });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, select: '-password' }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot delete yourself' });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const status = req.query.status;

  const query = status ? { status } : {};

  const [total, orders] = await Promise.all([
    Order.countDocuments(query),
    Order.find(query)
      .populate('restaurant', 'name')
      .populate('customer', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.json({ total, page, limit, pages: Math.ceil(total / limit), data: orders });
};

// GET /api/admin/reviews
const getAllReviews = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const status = req.query.status;

  const query = status ? { moderationStatus: status } : {};

  const [total, reviews] = await Promise.all([
    Review.countDocuments(query),
    Review.find(query)
      .populate('customer', 'username')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.json({ total, page, limit, pages: Math.ceil(total / limit), data: reviews });
};

module.exports = { getStats, getUsers, updateUserRole, deleteUser, getAllOrders, getAllReviews };
