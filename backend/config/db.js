const mysql = require("mysql2/promise");
require("dotenv").config();
const Logger = require("../utils/logger");

// MySQL connection pool configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "saralseva_ai",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        Logger.success("MySQL connected successfully to saralseva_ai database");
        connection.release();
        return true;
    } catch (err) {
        Logger.error("MySQL connection error:", err.message);
        return false;
    }
};

// Create database tables if they don't exist
const initializeTables = async () => {
    try {
        // Users table
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                last_login TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_phone (phone)
            )
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
                INDEX idx_token (token),
                INDEX idx_user_id (user_id)
            )
        `;
        await pool.query(createSessionsTable);
        Logger.success("Sessions table ready");

        // Documents table
        const createDocumentsTable = `
            CREATE TABLE IF NOT EXISTS documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(100),
                file_path VARCHAR(500),
                status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await pool.query(createDocumentsTable);
        Logger.success("Documents table ready");

        // Services table
        const createServicesTable = `
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                icon VARCHAR(100),
                category VARCHAR(100),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(createServicesTable);
        Logger.success("Services table ready");

        // Offices table
        const createOfficesTable = `
            CREATE TABLE IF NOT EXISTS offices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(100),
                pincode VARCHAR(10),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                phone VARCHAR(20),
                services_available TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(createOfficesTable);
        Logger.success("Offices table ready");

        // Service Workflows table
        const createWorkflowsTable = `
            CREATE TABLE IF NOT EXISTS service_workflows (
                id INT AUTO_INCREMENT PRIMARY KEY,
                service_id INT NOT NULL,
                step_number INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                required_documents TEXT,
                estimated_time VARCHAR(100),
                FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
            )
        `;
        await pool.query(createWorkflowsTable);
        Logger.success("Service workflows table ready");

    } catch (err) {
        Logger.error("Error initializing tables:", err.message);
        throw err;
    }
};

// Initialize database
const initializeDatabase = async () => {
    const isConnected = await testConnection();
    if (isConnected) {
        await initializeTables();
        return true;
    } else {
        Logger.warn("MySQL connection failed. Using in-memory database for development.");
        return false;
    }
};

// Export pool and initialization function
module.exports = {
    pool,
    initializeDatabase,
    query: async (sql, params) => {
        const [results] = await pool.query(sql, params);
        return results;
    }
};