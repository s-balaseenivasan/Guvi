const express = require('express');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  markPaymentFailed,
  getPaymentHistory,
} = require('../controller/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);
router.post('/fail', protect, markPaymentFailed);
router.get('/history', protect, getPaymentHistory);

module.exports = router;
