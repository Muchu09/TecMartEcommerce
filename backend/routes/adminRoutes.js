const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const {
  adminLogin,
  getProducts,
  addProduct,
  editProduct,
  deleteProduct,
  getAdminStats,
  getUsers,
  deleteUser,
  getOrders,
  updateOrderStatus
} = require('../controllers/adminController');

// All paths will be prefixed with /api/admin
router.post('/login', adminLogin);

// Unified Auth Middleware: [auth, adminCheck]
router.get('/products', [auth, adminCheck], getProducts);
router.post('/product/add', [auth, adminCheck], addProduct);
router.put('/product/:id', [auth, adminCheck], editProduct);
router.delete('/product/:id', [auth, adminCheck], deleteProduct);

router.get('/stats', [auth, adminCheck], getAdminStats);
router.get('/users', [auth, adminCheck], getUsers);
router.delete('/users/:id', [auth, adminCheck], deleteUser);
router.get('/orders', [auth, adminCheck], getOrders);
router.put('/orders/:id', [auth, adminCheck], updateOrderStatus);

module.exports = router;
