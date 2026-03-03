const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require('../controller/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.post('/', protect, authorizeRoles('customer'), createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', validateObjectId, protect, getOrderById);
router.patch('/:id/status', validateObjectId, protect, authorizeRoles('restaurant', 'admin'), updateOrderStatus);
// WARN-07 FIX: Customer can cancel their own pending/confirmed order
router.patch('/:id/cancel', validateObjectId, protect, authorizeRoles('customer'), cancelOrder);

module.exports = router;
