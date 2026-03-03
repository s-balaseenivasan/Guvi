const mongoose = require('mongoose');

// BUG-04 FIX: Validates all :id and :restaurantId params are valid MongoDB ObjectIds
// Prevents CastError 500 crashes from invalid IDs
const validateObjectId = (req, res, next) => {
  const id = req.params.id || req.params.restaurantId;
  if (id && !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

module.exports = validateObjectId;
