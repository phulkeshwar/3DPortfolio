require('dotenv').config();
console.log('GEMINI_API_KEY Loaded:', !!process.env.GEMINI_API_KEY);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://myportfolio-client.vercel.app',
    'https://phulkeshwar.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Connect to Database
console.log('Connecting to database...');
connectDB();

// Routes Placeholder
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

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

// Global Error Handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    // In many cases, it's safer to exit the process after an uncaught exception
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});
// Nodemon restart trigger

