const Item = require('../models/Item');

/**
 * @desc    Get all items
 * @route   GET /api/items
 * @access  Public
 */
const getItems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const total = await Item.countDocuments();
    const items = await Item.find()
      .populate('seller', 'username email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    res.json({
        success: true,
        count: items.length,
        pagination: {
          page,
          limit,
          total
        },
        data: items
    });
  } catch (err) {
    console.error('Fetch Items Error:', err.message);
    next(err);
  }
};

/**
 * @desc    Get single item
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('seller', 'username email');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({
        success: true,
        data: item
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new item
 * @route   POST /api/items
 * @access  Private
 */
const createItem = async (req, res, next) => {
  const { title, description, price, category, image } = req.body;

  try {
    if (!title || !price || !category) {
      return res.status(400).json({ message: 'Title, price, and category are required' });
    }

    if (isNaN(price)) {
      return res.status(400).json({ message: 'Price must be a number' });
    }

    const newItem = new Item({
      title,
      description,
      price,
      category,
      image,
      seller: req.user.id,
    });

    const item = await newItem.save();
    res.status(201).json({
        success: true,
        data: item
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update item
 * @route   PUT /api/items/:id
 * @access  Private (seller or admin)
 */
const updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the seller OR an admin
    if (item.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this item' });
    }

    const allowedUpdates = ['title', 'description', 'price', 'category', 'image', 'status'];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updateData[key] = req.body[key];
        }
    });

    const updatedItem = await Item.findByIdAndUpdate(
        req.params.id, 
        { $set: updateData }, 
        { new: true, runValidators: true }
    );

    res.json({
        success: true,
        data: updatedItem
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete item
 * @route   DELETE /api/items/:id
 * @access  Private (seller or admin)
 */
const deleteItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the seller OR an admin
    if (item.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ 
        success: true,
        message: 'Item removed successfully' 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};