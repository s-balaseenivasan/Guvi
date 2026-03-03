const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// POST /api/payments/create-order
const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized for this order' });
  }

  // Block payment for orders already in terminal states
  if (['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({ message: `Order is already ${order.status}` });
  }

  // Allow retry: reset payment_failed back to pending_payment
  if (order.status === 'payment_failed') {
    order.status = 'pending_payment';
    order.paymentStatus = 'pending';
    await order.save();
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    return res.status(400).json({
      message: 'Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env',
    });
  }

  const rzpOrder = await razorpay.orders.create({
    amount: Math.round(order.totalAmount * 100), // paise
    currency: 'INR',
    receipt: order._id.toString(),
    notes: {
      orderId: order._id.toString(),
      customerId: req.user._id.toString(),
    },
  });

  await Payment.create({
    order: order._id,
    customer: req.user._id,
    amount: order.totalAmount,
    currency: 'INR',
    provider: 'razorpay',
    status: 'initiated',
    razorpayOrderId: rzpOrder.id,
  });

  res.json({
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
};

// POST /api/payments/verify
const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(400).json({ message: 'Razorpay not configured' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid payment signature' });
  }

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) return res.status(404).json({ message: 'Payment record not found' });

  // Idempotency — don't double-process an already verified payment
  if (payment.status === 'succeeded') {
    return res.json({ success: true, message: 'Payment already verified' });
  }

  payment.status = 'succeeded';
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  await payment.save();

  // Payment succeeded → set to confirmed so restaurant can now see & act on it
  await Order.findByIdAndUpdate(payment.order, {
    paymentStatus: 'paid',
    status: 'confirmed',
  });

  res.json({ success: true, message: 'Payment verified successfully' });
};

// POST /api/payments/fail — called by frontend when payment is cancelled or fails
const markPaymentFailed = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: 'orderId is required' });

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Only update if still in payment-pending state (idempotent if already failed/confirmed)
  if (order.status !== 'pending_payment') {
    return res.json({ success: true, message: 'Order already processed' });
  }

  order.status = 'payment_failed';
  order.paymentStatus = 'failed';
  await order.save();

  // Mark the most recent initiated payment record as failed
  await Payment.findOneAndUpdate(
    { order: order._id, status: 'initiated' },
    { status: 'failed' },
    { sort: { createdAt: -1 } }
  );

  res.json({ success: true });
};

// GET /api/payments/history
const getPaymentHistory = async (req, res) => {
  const payments = await Payment.find({ customer: req.user._id })
    .populate('order', 'status totalAmount createdAt')
    .sort({ createdAt: -1 });

  res.json(payments);
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment, markPaymentFailed, getPaymentHistory };
