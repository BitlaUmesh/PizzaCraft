const express = require('express');
const router = express.Router();
const { getAllInventory, updateStock } = require('../controllers/inventoryController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', protect, isAdmin, getAllInventory);
router.patch('/:id', protect, isAdmin, updateStock);

module.exports = router;
