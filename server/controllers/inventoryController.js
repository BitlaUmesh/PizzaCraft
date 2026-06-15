const Inventory = require('../models/Inventory');

// GET /api/inventory
const getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ category: 1, name: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/inventory/:id
const updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined || quantity < 0)
      return res.status(400).json({ success: false, message: 'Valid quantity required' });

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity, lastRestockedAt: new Date() },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    res.json({ success: true, message: 'Stock updated', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllInventory, updateStock };
