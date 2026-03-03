const mongoose = require('mongoose');

const hourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    open: { type: String, default: '09:00' },
    close: { type: String, default: '22:00' },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    location: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    cuisineType: [{ type: String }],
    hoursOfOperation: [hourSchema],
    images: [{ type: String }],
    priceRange: { type: Number, min: 1, max: 4, default: 2 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
