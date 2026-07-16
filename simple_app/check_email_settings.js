import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkEmailSettings() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'modern_stack_db',
    });

    try {
        const [rows] = await pool.query('SELECT * FROM email_settings');
        console.log("--- Email Settings in DB ---");
        console.table(rows);
    } catch (err) {
        console.error("❌ Check failed:", err.message);
    } finally {
        pool.end();
    }
}

checkEmailSettings();
