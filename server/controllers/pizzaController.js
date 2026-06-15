const Pizza = require('../models/Pizza');
const Inventory = require('../models/Inventory');

// GET /api/pizzas
const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true });
    res.json({ success: true, data: pizzas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/pizzas/:id
const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    res.json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/pizzas/builder/options — returns all active ingredients by category
const getBuilderOptions = async (req, res) => {
  try {
    const items = await Inventory.find({ isActive: true }).select('name category quantity');
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push({ name: item.name, inStock: item.quantity > 0 });
      return acc;
    }, {});
    res.json({ success: true, data: grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: POST /api/pizzas
const createPizza = async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: PUT /api/pizzas/:id
const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    res.json({ success: true, data: pizza });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin: DELETE /api/pizzas/:id
const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
    res.json({ success: true, message: 'Pizza deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllPizzas, getPizzaById, getBuilderOptions, createPizza, updatePizza, deletePizza };
