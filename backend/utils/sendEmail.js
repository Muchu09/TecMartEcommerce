const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer via Gmail SMTP.
 * Requires SMTP_USER and SMTP_PASS in .env.
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async (options) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_USER === 'your_gmail_address@gmail.com') {
      console.warn('⚠️ SMTP_USER or SMTP_PASS is missing or invalid in .env. Emails cannot be sent.');
      console.warn(`Simulated Email to ${options.to} - Subject: ${options.subject}`);
      return true; // Simulate success for local testing if unconfigured, though real delivery will fail.
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const message = {
      from: `${process.env.FROM_NAME || 'TecMart Security'} <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log(`✉️ Message sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
    return false;
  }
};

module.exports = sendEmail;
