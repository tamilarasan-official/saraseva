const mysql = require("mysql2");
require("dotenv").config();
const Logger = require("../utils/logger");

// Create connection pool with production-ready configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "saralseva_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Export promise-based pool
const promisePool = pool.promise();

// Test connection
const testConnection = async() => {
    try {
        const connection = await promisePool.getConnection();
        Logger.success("MySQL connected successfully");
        connection.release();
        return true;
    } catch (err) {
        Logger.error("MySQL connection error:", err.message);
        return false;
    }
};

// Create database tables
const initializeTables = async() => {
    try {
        // Users table with additional fields
        const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

        await promisePool.query(createUsersTable);
        Logger.success("Users table ready");

        // You can add more tables here as needed
        // Example: Sessions table for token management
        const createSessionsTable = `
      CREATE TABLE IF NOT EXISTS sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token(255)),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

        await promisePool.query(createSessionsTable);
        Logger.success("Sessions table ready");

    } catch (err) {
        Logger.error("Error initializing tables:", err.message);
        throw err;
    }
};

// Initialize database
const initializeDatabase = async() => {
    const isConnected = await testConnection();
    if (isConnected) {
        await initializeTables();
    } else {
        Logger.error("Failed to connect to database. Please check your configuration.");
        process.exit(1);
    }
};

// Run initialization
initializeDatabase();

// Handle pool errors
pool.on('error', (err) => {
    Logger.error('Unexpected database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        Logger.warn('Database connection lost. Reconnecting...');
    }
});

module.exports = promisePool;