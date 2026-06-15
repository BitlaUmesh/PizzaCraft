const nodemailer = require('nodemailer');

// Mock transporter for development - logs to console instead of sending real email
const createMockTransporter = () => ({
  sendMail: async (options) => {
    console.log('\n📧 ===== MOCK EMAIL (Dev Mode) =====');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.html || options.text}`);
    console.log('====================================\n');
    return { messageId: 'mock-' + Date.now() };
  }
});

const createRealTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Use real transporter only if credentials are set
const transporter =
  process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your@gmail.com'
    ? createRealTransporter()
    : createMockTransporter();

module.exports = transporter;
