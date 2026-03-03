const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const createRestaurant = async (req, res) => {
  const exists = await Restaurant.findOne({ owner: req.user._id });
  if (exists) return res.status(400).json({ message: 'Restaurant already exists for this owner' });

  const restaurant = await Restaurant.create({ ...req.body, owner: req.user._id });
  res.status(201).json(restaurant);
};

const updateRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  if (restaurant.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized for this restaurant' });
  }

  const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  if (restaurant.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized for this restaurant' });
  }

  // WARN-02 FIX: Cascade-delete all menu items for this restaurant
  await MenuItem.deleteMany({ restaurant: restaurant._id });
  await restaurant.deleteOne();
  res.json({ message: 'Restaurant deleted' });
};

const getRestaurantById = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'username email');
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
  res.json(restaurant);
};

const getMyRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
  res.json(restaurant);
};

const getRestaurants = async (req, res) => {
  const { city, cuisine, rating, price, search, page = 1, limit = 10 } = req.query;
  const query = {};

  if (city) query['location.city'] = { $regex: city, $options: 'i' };
  if (cuisine) query.cuisineType = { $in: [new RegExp(cuisine, 'i')] };
  if (rating) query.rating = { $gte: Number(rating) };
  if (price) query.priceRange = Number(price);
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.min(50, Math.max(1, Number(limit)));

  const total = await Restaurant.countDocuments(query);
  const restaurants = await Restaurant.find(query)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  res.json({
    data: restaurants,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      limit: limitNumber,
    },
  });
};

module.exports = {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  getMyRestaurant,
};
