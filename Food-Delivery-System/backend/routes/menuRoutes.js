const express = require('express');
const {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controller/menuController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.post('/', protect, authorizeRoles('restaurant'), createMenuItem);
router.put('/:id', validateObjectId, protect, authorizeRoles('restaurant'), updateMenuItem);
router.delete('/:id', validateObjectId, protect, authorizeRoles('restaurant'), deleteMenuItem);

module.exports = router;
