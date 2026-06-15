const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
      required: true,
    },
    quantity: { type: Number, required: true, default: 100, min: 0 },
    threshold: { type: Number, default: 20 },
    unit: { type: String, default: 'units' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

inventorySchema.index({ category: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
