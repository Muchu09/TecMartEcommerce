const express = require('express');
const router = express.Router();
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');

const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const itemValidationRules = [
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('description').notEmpty().withMessage('Description is required').trim().escape(),
  body('price').isNumeric().withMessage('Price must be a valid number'),
  body('category').notEmpty().withMessage('Category is required').trim().escape()
];

// @route   GET /api/items
// @desc    Get all items
// @access  Public
router.get('/', getItems);

// @route   GET /api/items/:id
// @desc    Get single item
// @access  Public
router.get('/:id', getItem);

// @route   POST /api/items
// @desc    Create new item
// @access  Private (Admin only)
router.post('/', [auth, adminCheck, ...itemValidationRules, validateRequest], createItem);

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (Admin only)
router.put('/:id', [auth, adminCheck, ...itemValidationRules, validateRequest], updateItem);

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (Admin only)
router.delete('/:id', [auth, adminCheck], deleteItem);

module.exports = router;