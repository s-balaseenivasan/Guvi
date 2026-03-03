const express = require('express');
const {
  createReview,
  getRestaurantReviews,
  respondToReview,
  moderateReview,
} = require('../controller/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.post('/', protect, authorizeRoles('customer'), createReview);
router.get('/restaurant/:restaurantId', validateObjectId, getRestaurantReviews);
router.patch('/:id/respond', validateObjectId, protect, authorizeRoles('restaurant'), respondToReview);
router.patch('/:id/moderate', validateObjectId, protect, authorizeRoles('admin'), moderateReview);

module.exports = router;
