import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.SMTP_USER, // You receive the email
      subject: `New message from ${name}`,
      text: message,
    });

    res.status(200).json({ message: '✅ Message sent successfully!' });
  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({ message: 'Something went wrong while sending the email.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
