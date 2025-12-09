const { Pool } = require("pg");
require("dotenv").config();
const Logger = require("../utils/logger");

// Create connection pool with production-ready configuration
const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "saraseva",
    port: process.env.DB_PORT || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection
const testConnection = async() => {
    try {
        const client = await pool.connect();
        Logger.success("PostgreSQL connected successfully");
        client.release();
        return true;
    } catch (err) {
        Logger.error("PostgreSQL connection error:", err.message);
        return false;
    }
};

// Create database tables
const initializeTables = async() => {
    try {
        // Users table with additional fields
        const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_phone ON users(phone);
    `;

        await pool.query(createUsersTable);
        Logger.success("Users table ready");

        // Sessions table for token management
        const createSessionsTable = `
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_token ON sessions(token);
      CREATE INDEX IF NOT EXISTS idx_user_id ON sessions(user_id);
    `;

        await pool.query(createSessionsTable);
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
});

module.exports = pool;