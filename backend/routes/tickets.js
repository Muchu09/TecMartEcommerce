const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');

/**
 * @route   POST /api/tickets
 * @desc    Submit a new support ticket (public – no auth required)
 * @access  Public
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, email, category, subject, message } = req.body;

    if (!name || !email || !category || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (message.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Message must be at least 20 characters.' });
    }

    const ticket = await SupportTicket.create({ name, email, category, subject, message });
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
