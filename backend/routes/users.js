const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  deleteUserAccount,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/userController');

router.route('/profile')
  .get(auth, getUserProfile)
  .put(auth, updateUserProfile)
  .delete(auth, deleteUserAccount);

router.route('/address')
  .post(auth, addAddress);

router.route('/address/:addressId')
  .delete(auth, deleteAddress);

router.route('/wishlist')
  .get(auth, getWishlist)
  .post(auth, addToWishlist);

router.route('/wishlist/:itemId')
  .delete(auth, removeFromWishlist);

module.exports = router;
