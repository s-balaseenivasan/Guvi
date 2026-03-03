const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

const getRestaurantMenu = async (req, res) => {
  const menu = await MenuItem.find({ restaurant: req.params.restaurantId }).sort({ category: 1, name: 1 });
  res.json(menu);
};

const createMenuItem = async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found for owner' });

  const menuItem = await MenuItem.create({ ...req.body, restaurant: restaurant._id });
  res.status(201).json(menuItem);
};

const updateMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate('restaurant');
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  if (item.restaurant.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized for this menu item' });
  }

  const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate('restaurant');
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  if (item.restaurant.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized for this menu item' });
  }

  await item.deleteOne();
  res.json({ message: 'Menu item deleted' });
};

module.exports = { getRestaurantMenu, createMenuItem, updateMenuItem, deleteMenuItem };
