const router = require('express').Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Place order
router.post('/', auth, async (req, res) => {
  const order = await Order.create({ ...req.body, user: req.user.id });
  res.json(order);
});

// My orders
router.get('/my', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('items.product');
  res.json(orders);
});

// All orders (admin)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const orders = await Order.find().populate('user', 'name email').populate('items.product');
  res.json(orders);
});

// Update order status (admin)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

module.exports = router;