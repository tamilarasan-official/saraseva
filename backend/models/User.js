const { getConnection } = require("../config/db-auto");

/**
 * User Model - Handles all database operations for users
 * Compatible with MySQL and In-Memory database
 */
class User {
    /**
     * Find user by email
     * @param {string} email - User email address
     * @returns {Object|null} User object or null
     */
    static async findByEmail(email) {
        try {
            const db = getConnection();
            const result = await db.query(
                "SELECT * FROM users WHERE email = ?", [email]
            );
            // Handle both MySQL (array) and in-memory (object with rows)
            if (Array.isArray(result)) {
                return result[0] || null;
            }
            return result.rows ? result.rows[0] : result[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find user by phone number
     * @param {string} phone - User phone number
     * @returns {Object|null} User object or null
     */
    static async findByPhone(phone) {
        try {
            const db = getConnection();
            const result = await db.query(
                "SELECT * FROM users WHERE phone = ?", [phone]
            );
            if (Array.isArray(result)) {
                return result[0] || null;
            }
            return result.rows ? result.rows[0] : result[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create new user
     * @param {Object} userData - User data (first_name, last_name, email, phone, password)
     * @returns {number} Inserted user ID
     */
    static async create(userData) {
        try {
            const db = getConnection();
            const { first_name, last_name, email, phone, password, aadhaar, address, city, state, pincode } = userData;
            const result = await db.query(
                "INSERT INTO users (first_name, last_name, email, phone, password, aadhaar, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                [first_name, last_name || '', email, phone || '', password, aadhaar || '', address || '', city || '', state || '', pincode || '']
            );
            // Handle MySQL insertId
            return result.insertId || result.id;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find user by ID
     * @param {number} id - User ID
     * @returns {Object|null} User object or null
     */
    static async findById(id) {
        try {
            const db = getConnection();
            const result = await db.query(
                "SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?", [id]
            );
            if (Array.isArray(result)) {
                return result[0] || null;
            }
            return result.rows ? result.rows[0] : result[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update user's last login timestamp
     * @param {number} id - User ID
     * @returns {boolean} Success status
     */
    static async updateLastLogin(id) {
        try {
            const db = getConnection();
            await db.query(
                "UPDATE users SET last_login = NOW() WHERE id = ?", [id]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update user profile
     * @param {number} id - User ID
     * @param {Object} updates - Fields to update
     * @returns {boolean} Success status
     */
    static async update(id, updates) {
        try {
            const db = getConnection();
            const allowedFields = ['name', 'phone'];
            const fields = [];
            const values = [];

            for (const [key, value] of Object.entries(updates)) {
                if (allowedFields.includes(key)) {
                    fields.push(`${key} = ?`);
                    values.push(value);
                }
            }

            if (fields.length === 0) {
                return false;
            }

            values.push(id);
            await db.query(
                `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
                values
            );
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Delete user
     * @param {number} id - User ID
     * @returns {boolean} Success status
     */
    static async delete(id) {
        try {
            const db = getConnection();
            await db.query("DELETE FROM users WHERE id = ?", [id]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all users (admin only - paginated)
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Array} List of users
     */
    static async getAll(page = 1, limit = 10) {
        try {
            const db = getConnection();
            const offset = (page - 1) * limit;
            const result = await db.query(
                "SELECT id, name, email, phone, is_verified, created_at FROM users LIMIT ? OFFSET ?", 
                [limit, offset]
            );
            if (Array.isArray(result)) {
                return result;
            }
            return result.rows || result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
