/**
 * Database configuration with fallback to in-memory database
 * Automatically uses in-memory DB if MySQL is not available
 */

const Logger = require("../utils/logger");
require("dotenv").config();

let dbConnection = null;
let usingInMemoryDb = false;

async function initializeDatabase() {
    // Try MySQL first
    try {
        const mysql = require("mysql2");

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

        const promisePool = pool.promise();

        // Test connection
        const connection = await promisePool.getConnection();
        Logger.success("MySQL connected successfully");
        connection.release();

        // Create tables
        await createMySQLTables(promisePool);

        dbConnection = promisePool;
        usingInMemoryDb = false;

        // Handle pool errors
        pool.on('error', (err) => {
            Logger.error('Unexpected database error:', err);
        });

        return promisePool;

    } catch (error) {
        Logger.warn("MySQL connection failed:", error.message);
        Logger.info("Falling back to In-Memory Database for development...");

        // Fallback to in-memory database
        const InMemoryDB = require("./inMemoryDb");
        await InMemoryDB.initialize();
        dbConnection = InMemoryDB;
        usingInMemoryDb = true;

        return InMemoryDB;
    }
}

async function createMySQLTables(pool) {
    try {
        // Users table
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

        await pool.query(createUsersTable);
        Logger.success("Users table ready");

        // Sessions table
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

        await pool.query(createSessionsTable);
        Logger.success("Sessions table ready");

    } catch (err) {
        Logger.error("Error creating tables:", err.message);
        throw err;
    }
}

// Initialize on module load
const dbPromise = initializeDatabase();

// Export a wrapper that ensures initialization is complete
module.exports = {
    query: async(...args) => {
        const db = await dbPromise;
        return db.query(...args);
    },
    isInMemory: () => usingInMemoryDb,
    getConnection: async() => {
        const db = await dbPromise;
        if (usingInMemoryDb) {
            throw new Error("In-memory database doesn't support getConnection");
        }
        return db.getConnection();
    }
};