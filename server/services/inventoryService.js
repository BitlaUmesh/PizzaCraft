const Inventory = require('../models/Inventory');
const { sendLowStockAlert } = require('./emailService');

// Decrement stock for all ingredients in a custom pizza
const decrementStock = async (customPizza) => {
  const { base, sauce, cheese, veggies = [] } = customPizza;
  const ingredientNames = [base, sauce, cheese, ...veggies].filter(Boolean);

  for (const name of ingredientNames) {
    const item = await Inventory.findOne({ name });
    if (!item) continue;

    item.quantity = Math.max(0, item.quantity - 1);
    await item.save();

    // Trigger alert if stock falls below threshold
    if (item.quantity < item.threshold) {
      sendLowStockAlert(item).catch((err) =>
        console.error('Low stock alert email error:', err.message)
      );
    }
  }
};

module.exports = { decrementStock };
