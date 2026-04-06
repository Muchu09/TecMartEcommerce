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
router.post('/', [auth, adminCheck], createItem);

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (Admin only)
router.put('/:id', [auth, adminCheck], updateItem);

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (Admin only)
router.delete('/:id', [auth, adminCheck], deleteItem);

module.exports = router;