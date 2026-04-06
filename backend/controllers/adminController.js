const Item = require('../models/Item');
const User = require('../models/User');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const envAdminEmail = process.env.ADMIN_EMAIL?.trim();
    const envAdminHash = process.env.ADMIN_PASSWORD_HASH?.trim();

    const cleanEmail = email?.trim();

    let user = await User.findOne({ email: cleanEmail });

    // 1. Check if it matches Super Admin credentials from .env (using bcrypt hash)
    let isEnvMatch = false;
    if (envAdminEmail && envAdminHash && cleanEmail === envAdminEmail) {
      isEnvMatch = await bcrypt.compare(password, envAdminHash);
    }

    if (isEnvMatch) {
      // If matches .env but user doesn't exist in DB, create a skeletal one
      if (!user) {
        user = new User({
          username: 'SystemAdmin',
          email: envAdminEmail,
          password: envAdminHash,
          role: 'admin'
        });
        await user.save();
      } else if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    } else {
      // 2. Standard DB + Bcrypt check
      if (!user || user.role !== 'admin') {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }
    }

    // Success - generate token
    const payload = {
      user: {
        id: user._id || user.id,
        role: user.role,
      },
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    jwt.sign(
      payload,
      secret,
      { expiresIn: '12h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          success: true, 
          token, 
          user: { id: user._id || user.id, username: user.username, email: user.email, role: user.role } 
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all products (admin view)
 */
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Item.find().populate('seller', 'username email').sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add a new product (admin)
 */
exports.addProduct = async (req, res, next) => {
  try {
    const { title, name, description, price, image, category, stock, seller } = req.body;
    
    // Find an admin user to act as seller if none provided
    let sellerId = seller || req.user.id;
    
    const product = new Item({
      title: title || name,
      description,
      price,
      image,
      category,
      status: Number(stock) > 0 ? 'available' : 'sold',
      seller: sellerId
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Edit an existing product (admin)
 */
exports.editProduct = async (req, res, next) => {
  try {
    const { name, title, description, price, image, category, stock, status } = req.body;
    
    const product = await Item.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateData = {
      title: name || title || product.title,
      description: description || product.description,
      price: price !== undefined ? price : product.price,
      image: image || product.image,
      category: category || product.category,
      status: status || product.status
    };

    if (stock !== undefined) {
      updateData.status = Number(stock) > 0 ? 'available' : 'sold';
    }

    const updatedProduct = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a product (admin)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Item.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get dashboard statistics
 */
exports.getAdminStats = async (req, res, next) => {
  try {
    const [userCount, itemCount, orderCount] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Order.countDocuments()
    ]);
    
    // Calculate total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.json({ 
      success: true,
      data: {
        users: userCount, 
        items: itemCount, 
        orders: orderCount,
        revenue: totalRevenue
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all users
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a user
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User removed successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all orders
 */
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('item')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update order status
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
