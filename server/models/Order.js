const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderType: { type: String, enum: ['standard', 'custom'], required: true },

    // For standard pizza orders
    pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' },
    pizzaName: { type: String },

    // For custom pizza orders
    customPizza: {
      base: { type: String },
      sauce: { type: String },
      cheese: { type: String },
      veggies: [{ type: String }],
    },

    quantity: { type: Number, default: 1, min: 1 },
    totalPrice: { type: Number, required: true },

    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    status: {
      type: String,
      enum: ['Order Received', 'In Kitchen', 'Sent to Delivery'],
      default: 'Order Received',
    },

    payment: {
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      isPaid: { type: Boolean, default: false },
      paidAt: { type: Date },
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
