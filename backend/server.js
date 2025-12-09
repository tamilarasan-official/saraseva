const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

// Use auto-fallback database (MySQL or In-Memory)
const db = require("./config/db-auto");

const Logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:8000',
            'http://localhost:3000',
            'http://localhost:5500',
            'http://127.0.0.1:8000',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5500',
            process.env.FRONTEND_URL
        ].filter(Boolean);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins in development
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression Middleware
app.use(compression());

// Request Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// Rate Limiting
app.use("/api", apiLimiter);

// Health Check Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SaralSeva Backend API is running",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use("/api/auth", require("./routes/auth"));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

// Global Error Handler
app.use(errorHandler);

// Server Configuration
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    Logger.success(`Server running on http://localhost:${PORT}`);
    Logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    Logger.info(`Database: ${process.env.DB_NAME}`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
    Logger.info("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        Logger.info("HTTP server closed");
        process.exit(0);
    });
});

process.on("SIGINT", () => {
    Logger.info("SIGINT signal received: closing HTTP server");
    server.close(() => {
        Logger.info("HTTP server closed");
        process.exit(0);
    });
});

module.exports = app;