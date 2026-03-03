const express = require('express');
const {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  getAllReviews,
} = require('../controller/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorizeRoles('admin'));

router.get('/stats', getStats);

router.get('/users', getUsers);
router.patch('/users/:id/role', validateObjectId, updateUserRole);
router.delete('/users/:id', validateObjectId, deleteUser);

router.get('/orders', getAllOrders);
router.get('/reviews', getAllReviews);

module.exports = router;
