const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Statuses that are NOT real confirmed orders — hidden from restaurant dashboard
const PAYMENT_PENDING_STATUSES = ['pending_payment', 'payment_failed'];

const isWithinRestaurantHours = (restaurant, dateValue) => {
  if (!dateValue || !restaurant.hoursOfOperation?.length) return true;
  const date = new Date(dateValue);
  const day = dayNames[date.getDay()];
  const hour = restaurant.hoursOfOperation.find((h) => h.day === day);
  if (!hour || hour.closed) return false;

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const value = `${hh}:${mm}`;
  return value >= hour.open && value <= hour.close;
};

const createOrder = async (req, res) => {
  const {
    restaurantId,
    items,
    deliveryAddress,
    deliveryType = 'asap',
    scheduledAt,
    timeWindow,
  } = req.body;

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  if (deliveryType === 'scheduled') {
    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({ message: 'scheduledAt must be in the future' });
    }
    if (!isWithinRestaurantHours(restaurant, scheduledAt)) {
      return res.status(400).json({ message: 'Scheduled time is outside restaurant operating hours' });
    }
  }

  const menuIds = items.map((item) => item.menuItem);
  const menuItems = await MenuItem.find({ _id: { $in: menuIds }, restaurant: restaurantId });
  if (menuItems.length !== items.length) {
    return res.status(400).json({ message: 'One or more menu items are invalid' });
  }

  const mappedItems = items.map((item) => {
    const dbItem = menuItems.find((menu) => menu._id.toString() === item.menuItem);
    const addOns = item.selectedAddOns || [];
    const addOnTotal = addOns.reduce((sum, addon) => sum + Number(addon.price || 0), 0);

    return {
      menuItem: dbItem._id,
      name: dbItem.name,
      image: dbItem.image || '',
      quantity: item.quantity,
      price: dbItem.price + addOnTotal,
      selectedAddOns: addOns,
      specialInstructions: item.specialInstructions || '',
    };
  });

  const subtotal = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 3.99 : 0;
  const totalAmount = subtotal + deliveryFee;

  // Status starts as pending_payment — NOT visible to restaurant until payment succeeds
  const order = await Order.create({
    customer: req.user._id,
    restaurant: restaurantId,
    items: mappedItems,
    subtotal,
    deliveryFee,
    totalAmount,
    deliveryAddress,
    deliveryType,
    scheduledAt: deliveryType === 'scheduled' ? scheduledAt : null,
    timeWindow,
    status: 'pending_payment',
  });

  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const query = req.user.role === 'customer' ? { customer: req.user._id } : {};

  if (req.user.role === 'restaurant') {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) return res.json([]);
    // Only show orders that have completed payment (status NOT in payment-pending set)
    query.restaurant = restaurant._id;
    query.status = { $nin: PAYMENT_PENDING_STATUSES };
  }

  const orders = await Order.find(query)
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 });

  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name')
    .populate('customer', 'username email');

  if (!order) return res.status(404).json({ message: 'Order not found' });

  const isCustomerOwner = order.customer._id.toString() === req.user._id.toString();
  const restaurant = await Restaurant.findById(order.restaurant._id);
  const isRestaurantOwner = restaurant?.owner?.toString() === req.user._id.toString();

  if (!isCustomerOwner && !isRestaurantOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized for this order' });
  }

  res.json(order);
};

const validTransitions = {
  // Payment-gated statuses (managed by payment controller, not restaurant)
  pending_payment: [],
  payment_failed: [],
  // Normal flow (after payment confirmed)
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: [],
};

const updateOrderStatus = async (req, res) => {
  const { status, etaMinutes } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const restaurant = await Restaurant.findById(order.restaurant);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized for this order' });
  }

  if (!validTransitions[order.status]?.includes(status)) {
    return res.status(400).json({
      message: `Invalid transition from ${order.status} to ${status}`,
    });
  }

  order.status = status;
  if (etaMinutes !== undefined) order.etaMinutes = etaMinutes;
  const updated = await order.save();

  res.json(updated);
};

// Customer can cancel their own order if payment confirmed (not yet preparing)
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const cancellable = ['pending', 'confirmed'];
  if (!cancellable.includes(order.status)) {
    return res.status(400).json({
      message: `Cannot cancel an order with status: ${order.status}`,
    });
  }

  order.status = 'cancelled';
  const updated = await order.save();
  res.json(updated);
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder };
