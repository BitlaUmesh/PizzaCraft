const express = require('express');
const router = express.Router();
const { getMyOrders, getOrderStatus, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/my-orders', protect, getMyOrders);
router.get('/admin/all', protect, isAdmin, getAllOrders);
router.get('/:id/status', protect, getOrderStatus);
router.patch('/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;
