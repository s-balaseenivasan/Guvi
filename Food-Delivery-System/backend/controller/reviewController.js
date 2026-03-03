const Review = require('../models/Review');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

const createReview = async (req, res) => {
  const { orderId, rating, comment } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Cannot review another customer order' });
  }
  if (order.status !== 'delivered') {
    return res.status(400).json({ message: 'Only delivered orders can be reviewed' });
  }

  const existing = await Review.findOne({ order: orderId, customer: req.user._id });
  if (existing) return res.status(400).json({ message: 'Review already exists for this order' });

  const review = await Review.create({
    customer: req.user._id,
    restaurant: order.restaurant,
    order: order._id,
    rating,
    comment,
    moderationStatus: 'approved', // auto-approve; admin can reject via PATCH /:id/moderate
  });

  res.status(201).json(review);
};

const getRestaurantReviews = async (req, res) => {
  const query = { restaurant: req.params.restaurantId };
  if (req.query.includePending !== 'true') query.moderationStatus = 'approved';

  const reviews = await Review.find(query)
    .populate('customer', 'username')
    .sort({ createdAt: -1 });

  res.json(reviews);
};

const respondToReview = async (req, res) => {
  const { message } = req.body;
  const review = await Review.findById(req.params.id).populate('restaurant');
  if (!review) return res.status(404).json({ message: 'Review not found' });

  const restaurant = await Restaurant.findById(review.restaurant._id);
  if (restaurant.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized for this review' });
  }

  review.restaurantResponse = {
    message,
    respondedAt: new Date(),
  };

  await review.save();
  res.json(review);
};

const moderateReview = async (req, res) => {
  const { moderationStatus } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });

  if (!['pending', 'approved', 'rejected'].includes(moderationStatus)) {
    return res.status(400).json({ message: 'Invalid moderation status' });
  }

  review.moderationStatus = moderationStatus;
  await review.save();
  res.json(review);
};

module.exports = { createReview, getRestaurantReviews, respondToReview, moderateReview };
