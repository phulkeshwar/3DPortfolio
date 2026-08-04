require('dotenv').config();
console.log('GEMINI_API_KEY Loaded:', !!process.env.GEMINI_API_KEY);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Security Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// NoSQL Injection Sanitization
app.use(mongoSanitize());

// Middleware
app.use(express.json({ limit: '10kb' }));

// Logging Middleware
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
        next();
    });
}

// CORS Config
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://myportfolio-client.vercel.app',
    'https://phulkeshwar.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // Limit auth & AI endpoints to 15 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests to secure endpoint, please try again later' }
});

// Apply rate limiters
app.use('/api/', globalLimiter);
app.use('/api/auth/login', strictLimiter);
app.use('/api/auth/register', strictLimiter);
app.use('/api/ai/', strictLimiter);

// Connect to Database
console.log('Connecting to database...');
connectDB();

// Health check endpoint
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

try {
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/projects', require('./routes/projectRoutes'));
    app.use('/api/contact', require('./routes/contactRoutes'));
    app.use('/api/ai', require('./routes/aiRoutes'));
    app.use('/api/skills', require('./routes/skillRoutes'));
    console.log('Routes loaded successfully.');
} catch (error) {
    console.error('Error loading routes:', error);
}

// Global Express Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❌ Express Error Handler caught:', err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

// Global Process Error Handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});
// Nodemon restart trigger

