const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// If running behind a proxy (Render, Vercel), trust forwarded headers
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow images from external sources
}));
app.use(mongoSanitize()); // Prevent NoSQL injection attacks

// Strict rate limiter for authentication endpoints (20 req / 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyGenerator: ipKeyGenerator,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});

// General API rate limiter (200 req / 15 min per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  keyGenerator: ipKeyGenerator,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

// Apply strict limiter to auth & admin-login routes FIRST
app.use('/api/auth/', authLimiter);
app.use('/api/admin/login', authLimiter);

// Apply general limiter to all other API routes
app.use('/api/', generalLimiter);

// Basic Middleware
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175',
     'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178',
     'http://localhost:5184', 'http://localhost:5186', 'http://localhost:5188'];

if (process.env.NODE_ENV !== 'production') {
  console.log('CORS allowed origins:', allowedOrigins);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy does not allow this origin'), false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10kb' })); // Limit payload size

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/items', require('./routes/items'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/orders', require('./routes/orders'));

// 404 catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized error handling middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});