const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  register, 
  login
} = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password must be at least 8 characters long and strong').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
], register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').notEmpty().trim(),
], login);

module.exports = router;