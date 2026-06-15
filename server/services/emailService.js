const transporter = require('../config/email');

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"PizzaCraft 🍕" <${process.env.EMAIL_USER || 'noreply@pizzacraft.com'}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail({
    to: user.email,
    subject: '🍕 Verify your PizzaCraft Email',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#1a1a2e;color:#fff;padding:30px;border-radius:12px;">
        <h2 style="color:#FF6B35;">Welcome to PizzaCraft, ${user.name}! 🍕</h2>
        <p>Click the button below to verify your email address:</p>
        <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(90deg,#FF6B35,#FFB800);color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Verify Email
        </a>
        <p style="color:#9a9a9a;font-size:12px;">Link expires in 24 hours. If you didn't register, ignore this.</p>
        <hr style="border-color:#2a2a4a;margin:20px 0;"/>
        <p style="color:#9a9a9a;">Or copy: <a href="${verifyUrl}" style="color:#FF6B35;">${verifyUrl}</a></p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail({
    to: user.email,
    subject: '🔒 PizzaCraft — Reset Your Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#1a1a2e;color:#fff;padding:30px;border-radius:12px;">
        <h2 style="color:#FF6B35;">Password Reset Request</h2>
        <p>Hi ${user.name}, click below to reset your password:</p>
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(90deg,#FF6B35,#FFB800);color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Reset Password
        </a>
        <p style="color:#9a9a9a;font-size:12px;">Link expires in 1 hour. If you didn't request this, ignore it.</p>
      </div>
    `,
  });
};

const sendOrderConfirmationEmail = async (user, order) => {
  await sendEmail({
    to: user.email,
    subject: '✅ PizzaCraft — Order Confirmed!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#1a1a2e;color:#fff;padding:30px;border-radius:12px;">
        <h2 style="color:#10B981;">Order Confirmed! 🎉</h2>
        <p>Hi ${user.name}, your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Amount Paid:</strong> ₹${order.totalPrice}</p>
        <p><strong>Status:</strong> Order Received</p>
        <p style="color:#9a9a9a;">Track your order in the app. We'll keep you posted!</p>
      </div>
    `,
  });
};

const sendLowStockAlert = async (ingredient) => {
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `⚠️ Low Stock Alert: ${ingredient.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#1a1a2e;color:#fff;padding:30px;border-radius:12px;">
        <h2 style="color:#F59E0B;">⚠️ Low Stock Alert</h2>
        <p>The following ingredient is running low:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;color:#9a9a9a;">Ingredient</td><td style="padding:8px;color:#fff;font-weight:bold;">${ingredient.name}</td></tr>
          <tr><td style="padding:8px;color:#9a9a9a;">Category</td><td style="padding:8px;color:#fff;">${ingredient.category}</td></tr>
          <tr><td style="padding:8px;color:#9a9a9a;">Current Stock</td><td style="padding:8px;color:#EF4444;font-weight:bold;">${ingredient.quantity} units</td></tr>
          <tr><td style="padding:8px;color:#9a9a9a;">Threshold</td><td style="padding:8px;color:#fff;">${ingredient.threshold} units</td></tr>
        </table>
        <p style="color:#9a9a9a;">Please restock this ingredient as soon as possible.</p>
      </div>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendLowStockAlert,
};
