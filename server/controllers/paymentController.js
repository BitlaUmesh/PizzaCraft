const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const { decrementStock } = require('../services/inventoryService');
const { sendOrderConfirmationEmail } = require('../services/emailService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('createRazorpayOrder error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// POST /api/payment/verify
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderData, // { orderType, pizzaId, pizzaName, customPizza, quantity, totalPrice, deliveryAddress }
    } = req.body;

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSig !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Create the Order in DB
    const order = await Order.create({
      userId: req.user._id,
      ...orderData,
      payment: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        isPaid: true,
        paidAt: new Date(),
      },
    });

    // Decrement inventory if custom pizza
    if (orderData.orderType === 'custom' && orderData.customPizza) {
      await decrementStock(orderData.customPizza);
    }

    // Send confirmation email
    const user = await User.findById(req.user._id);
    sendOrderConfirmationEmail(user, order).catch((err) =>
      console.error('Order confirm email error:', err.message)
    );

    res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
  } catch (error) {
    console.error('verifyPayment error:', error.message);
    res.status(500).json({ success: false, message: 'Server error placing order' });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
