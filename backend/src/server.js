require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const User = require('./models/User');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Campus Lost & Found API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();

    if (process.env.ADMIN_EMAIL) {
      await User.updateOne(
        { email: process.env.ADMIN_EMAIL.toLowerCase() },
        { $set: { isAdmin: true } }
      );
    }

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
}

startServer();
