const Order = require('../models/Order');
const Item = require('../models/Item');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { itemId, shippingAddress, contactPhone } = req.body;
    
    // 1. Fetch the item to get the REAL price
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status === 'sold') {
      return res.status(400).json({ message: 'This item has already been sold' });
    }

    // 2. Calculate total amount on the BACKEND (Security Fix)
    const totalAmount = item.price;

    const order = new Order({
      user: req.user.id,
      item: itemId,
      totalAmount,
      shippingAddress,
      contactPhone,
    });

    await order.save();
    
    // Optional: Mark item as sold
    item.status = 'sold';
    await item.save();

    res.status(201).json({
        success: true,
        data: order
    });
  } catch (err) {
    console.error('Create Order Error:', err.message);
    next(err);
  }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('item')
      .sort({ createdAt: -1 });
    
    res.json({
        success: true,
        count: orders.length,
        data: orders
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('item')
        .populate('user', 'username email');
        
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user is owner or admin
      if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
      }

      res.json({
          success: true,
          data: order
      });
    } catch (err) {
      next(err);
    }
  };
