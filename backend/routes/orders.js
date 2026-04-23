const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');

const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

// All paths will use auth middleware
router.use(auth);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
  '/',
  [
    body('itemId').isMongoId().withMessage('Valid Item ID is required'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required').trim().escape(),
    body('contactPhone').notEmpty().withMessage('Contact phone is required').trim().escape(),
    validateRequest
  ],
  createOrder
);

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', getOrderById);

module.exports = router;
