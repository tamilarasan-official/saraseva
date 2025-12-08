/**
 * In-Memory Database for Development (No MySQL required)
 * This is for testing when MySQL is not available
 */

const Logger = require("../utils/logger");

// In-memory storage
let users = [];
let userIdCounter = 1;
let sessions = [];

class InMemoryDB {
    static async initialize() {
        Logger.success("In-Memory Database initialized (Development Mode)");
        Logger.warn("WARNING: Data will be lost when server restarts!");
        Logger.info("For production, please use MySQL database");
        return true;
    }

    static async query(sql, params = []) {
        // Simulate async database operation
        return new Promise((resolve) => {
            setTimeout(() => {
                // Parse SQL and execute
                const result = this.executeQuery(sql, params);
                resolve([result]);
            }, 10);
        });
    }

    static executeQuery(sql, params) {
        const sqlLower = sql.toLowerCase().trim();

        // CREATE TABLE
        if (sqlLower.includes('create table')) {
            Logger.info('Table creation simulated in memory');
            return { affectedRows: 0 };
        }

        // INSERT
        if (sqlLower.includes('insert into users')) {
            const [name, email, phone, password] = params;
            const newUser = {
                id: userIdCounter++,
                name,
                email,
                phone,
                password,
                is_verified: false,
                last_login: null,
                created_at: new Date(),
                updated_at: new Date()
            };
            users.push(newUser);
            return { insertId: newUser.id, affectedRows: 1 };
        }

        // SELECT by email
        if (sqlLower.includes('select') && sqlLower.includes('where email')) {
            const email = params[0];
            const user = users.find(u => u.email === email);
            return user ? [user] : [];
        }

        // SELECT by phone
        if (sqlLower.includes('select') && sqlLower.includes('where phone')) {
            const phone = params[0];
            const user = users.find(u => u.phone === phone);
            return user ? [user] : [];
        }

        // SELECT by id
        if (sqlLower.includes('select') && sqlLower.includes('where id')) {
            const id = params[0];
            const user = users.find(u => u.id === id);
            if (user) {
                // Return user without password for profile queries
                const { password, ...userWithoutPassword } = user;
                return [userWithoutPassword];
            }
            return [];
        }

        // UPDATE last_login
        if (sqlLower.includes('update users') && sqlLower.includes('last_login')) {
            const id = params[0];
            const user = users.find(u => u.id === id);
            if (user) {
                user.last_login = new Date();
                return { affectedRows: 1 };
            }
            return { affectedRows: 0 };
        }

        // UPDATE user
        if (sqlLower.includes('update users')) {
            // Generic update handler
            return { affectedRows: 1 };
        }

        // DELETE user
        if (sqlLower.includes('delete from users')) {
            const id = params[0];
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                users.splice(index, 1);
                return { affectedRows: 1 };
            }
            return { affectedRows: 0 };
        }

        // SELECT all users (paginated)
        if (sqlLower.includes('select') && sqlLower.includes('limit')) {
            const limit = params[0] || 10;
            const offset = params[1] || 0;
            const paginatedUsers = users.slice(offset, offset + limit);
            return paginatedUsers.map(({ password, ...user }) => user);
        }

        return [];
    }

    static getStats() {
        return {
            totalUsers: users.length,
            totalSessions: sessions.length
        };
    }
}

module.exports = InMemoryDB;