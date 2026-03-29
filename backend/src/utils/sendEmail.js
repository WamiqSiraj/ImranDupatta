import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use 465 for SSL
    secure: true, // true for 465
    auth: {
      user: process.env.EMAIL_USER, // Your email (e.g., store@gmail.com)
      pass: process.env.EMAIL_PASS, // Your App Password (not your login password)
    },
  });

  const mailOptions = {
    from: `"Imran Dupatta" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmail;