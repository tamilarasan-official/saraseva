/**
 * SaralSeva AI Backend Server
 * Main entry point for the Express application
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const Logger = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const { initializeDatabase, isUsingInMemoryDb } = require('./config/db-auto');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Rate Limiting
app.use('/api/', apiLimiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: isUsingInMemoryDb() ? 'In-Memory' : 'MySQL',
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', authRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'SaralSeva AI API',
        version: '1.0.0',
        status: 'Running',
        endpoints: {
            health: '/health',
            auth: '/api/auth'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error Handler
app.use(errorHandler);

// Initialize Database and Start Server
async function startServer() {
    try {
        // Initialize database connection
        await initializeDatabase();
        
        // Start server
        app.listen(PORT, () => {
            Logger.success(`Server running on http://localhost:${PORT}`);
            Logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            Logger.info(`Database: ${isUsingInMemoryDb() ? 'In-Memory (Development)' : 'MySQL (saralseva_ai)'}`);
        });
    } catch (error) {
        Logger.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();

module.exports = app;
