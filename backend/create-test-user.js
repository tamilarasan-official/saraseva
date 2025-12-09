const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432
});

async function createTestUser() {
    try {
        // Delete existing test user first
        await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
        console.log('🗑️ Deleted existing test user');

        const hashedPassword = await bcrypt.hash('Test@123', 12);

        const result = await pool.query(
            `INSERT INTO users (name, email, phone, password, is_verified) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id`, ['Test User', 'test@example.com', '9876543210', hashedPassword, true]
        );

        console.log('✅ Test user created successfully!');
        console.log('User ID:', result.rows[0].id);

        console.log('\n📧 Login Credentials:');
        console.log('Email: test@example.com');
        console.log('Password: Test@123');
        console.log('Phone: 9876543210');

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test user:', error.message);
        await pool.end();
        process.exit(1);
    }
}

createTestUser();