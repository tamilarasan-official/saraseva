const db = require("../config/db-auto");

/**
 * User Model - Handles all database operations for users
 */
class User {
    /**
     * Find user by email
     * @param {string} email - User email address
     * @returns {Object|null} User object or null
     */
    static async findByEmail(email) {
        try {
            const result = await db.query(
                "SELECT * FROM users WHERE email = $1", [email]
            );
            return result.rows[0] || null;
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
            const result = await db.query(
                "SELECT * FROM users WHERE phone = $1", [phone]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Create new user
     * @param {Object} userData - User data (name, email, phone, password)
     * @returns {number} Inserted user ID
     */
    static async create(userData) {
        try {
            const { name, email, phone, password } = userData;
            const result = await db.query(
                "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id", [name, email, phone, password]
            );
            return result.rows[0].id;
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
            const result = await db.query(
                "SELECT id, name, email, phone, is_verified, created_at FROM users WHERE id = $1", [id]
            );
            return result.rows[0] || null;
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
            await db.query(
                "UPDATE users SET last_login = NOW() WHERE id = $1", [id]
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
            const allowedFields = ['name', 'phone'];
            const fields = [];
            const values = [];
            let paramIndex = 1;

            for (const [key, value] of Object.entries(updates)) {
                if (allowedFields.includes(key)) {
                    fields.push(`${key} = $${paramIndex}`);
                    values.push(value);
                    paramIndex++;
                }
            }

            if (fields.length === 0) {
                return false;
            }

            values.push(id);
            await db.query(
                `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
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
            await db.query("DELETE FROM users WHERE id = $1", [id]);
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
            const offset = (page - 1) * limit;
            const result = await db.query(
                "SELECT id, name, email, phone, is_verified, created_at FROM users LIMIT $1 OFFSET $2", [limit, offset]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;