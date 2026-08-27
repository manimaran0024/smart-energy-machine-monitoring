require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.post('/send-alert', async (req, res) => {
  const { subject, text, to } = req.body;

  try {
    await transporter.sendMail({
      from: `"ECM Monitor" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const port = Number(process.env.PORT) || 8000;

const server = app.listen(port, () =>
  console.log(`Email server running on port ${port}`)
);

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Use a different PORT or stop the existing process.`
    );
  } else {
    console.error('Email server error:', err);
  }

  process.exit(1);
});
