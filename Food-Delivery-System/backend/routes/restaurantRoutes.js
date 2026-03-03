const express = require('express');
const {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  getMyRestaurant,
} = require('../controller/restaurantController');
const { getRestaurantMenu } = require('../controller/menuController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/', getRestaurants);
router.get('/me', protect, authorizeRoles('restaurant'), getMyRestaurant);
router.get('/:id', validateObjectId, getRestaurantById);
router.get('/:restaurantId/menu', validateObjectId, getRestaurantMenu);
router.post('/', protect, authorizeRoles('restaurant'), createRestaurant);
router.put('/:id', validateObjectId, protect, authorizeRoles('restaurant'), updateRestaurant);
router.delete('/:id', validateObjectId, protect, authorizeRoles('restaurant'), deleteRestaurant);

module.exports = router;
