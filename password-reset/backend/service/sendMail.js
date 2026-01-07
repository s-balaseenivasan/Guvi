const nodemailer = require("nodemailer");

const sendMail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    logger: true,
    debug: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");
  } catch (error) {
    console.error("❌ SMTP verification failed:", error.message);
    throw error;
  }

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 15 minutes.</p>
    `
  });
};

module.exports = sendMail;
