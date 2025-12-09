/**
 * Database configuration with fallback to in-memory database
 * Automatically uses in-memory DB if PostgreSQL is not available
 */

const Logger = require("../utils/logger");
require("dotenv").config();

let dbConnection = null;
let usingInMemoryDb = false;

async function initializeDatabase() {
    // Try PostgreSQL first
    try {
        const { Pool } = require("pg");

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
        const client = await pool.connect();
        Logger.success("PostgreSQL connected successfully");
        client.release();

        // Create tables
        await createPostgreSQLTables(pool);

        dbConnection = pool;
        usingInMemoryDb = false;

        // Handle pool errors
        pool.on('error', (err) => {
            Logger.error('Unexpected database error:', err);
        });

        return pool;

    } catch (error) {
        Logger.warn("PostgreSQL connection failed:", error.message);
        Logger.info("Falling back to In-Memory Database for development...");

        // Fallback to in-memory database
        const InMemoryDB = require("./inMemoryDb");
        await InMemoryDB.initialize();
        dbConnection = InMemoryDB;
        usingInMemoryDb = true;

        return InMemoryDB;
    }
}

async function createPostgreSQLTables(pool) {
    try {
        // Users table
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

        // Sessions table
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