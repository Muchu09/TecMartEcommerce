const User = require('../models/User');

/**
 * Middleware to check if the user is an admin.
 * Assumes 'auth' middleware has already run and populated req.user.
 */
const adminCheck = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Administrator privileges required.' 
      });
    }
    
    next();
  } catch (err) {
    console.error('Admin Check Middleware Error:', err.message);
    next(err);
  }
};

module.exports = adminCheck;
