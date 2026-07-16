import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function clearSettings() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'simple_app_db',
    });

    try {
        await pool.query('DELETE FROM email_settings');
        console.log("✅ email_settings table cleared.");
    } catch (err) {
        console.error("❌ Cleanup failed:", err.message);
    } finally {
        pool.end();
    }
}

clearSettings();
