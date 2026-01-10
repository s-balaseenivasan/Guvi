const nodemailer = require("nodemailer");

const sendMail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,        // smtp.hostinger.com
    port: Number(process.env.SMTP_PORT), // 587
    secure: false,                      // TLS
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");
  } catch (error) {
    console.error("❌ SMTP verification failed:", error);
    throw error;
  }

  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Password Reset",
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 15 minutes.</p>
    `
  });
};

module.exports = sendMail;
