const express = require('express');
const router = express.Router();
const { getAllPizzas, getPizzaById, getBuilderOptions, createPizza, updatePizza, deletePizza } = require('../controllers/pizzaController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/builder/options', protect, getBuilderOptions);
router.get('/', protect, getAllPizzas);
router.get('/:id', protect, getPizzaById);
router.post('/', protect, isAdmin, createPizza);
router.put('/:id', protect, isAdmin, updatePizza);
router.delete('/:id', protect, isAdmin, deletePizza);

module.exports = router;
