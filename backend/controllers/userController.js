const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    if (req.body.preferences) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    if (req.body.password) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new password' });
      }

      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect current password' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
        preferences: updatedUser.preferences,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new address
// @route   POST /api/users/address
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newAddress = {
      label: req.body.label,
      street: req.body.street,
      city: req.body.city,
      zip: req.body.zip,
      isDefault: req.body.isDefault || false
    };

    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push(newAddress);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Address
// @route   DELETE /api/users/address/:addressId
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );

    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      await user.deleteOne();
      res.json({ success: true, message: 'User removed' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/users/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.wishlist.includes(req.body.itemId)) {
      user.wishlist.push(req.body.itemId);
      await user.save();
    }
    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/users/wishlist/:itemId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.itemId);
    await user.save();
    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    next(error);
  }
};
