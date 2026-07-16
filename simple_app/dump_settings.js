import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function dumpSettings() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'simple_app_db',
    });

    try {
        const [rows] = await pool.query('SELECT * FROM email_settings');
        fs.writeFileSync('settings_dump.json', JSON.stringify(rows, null, 2));
        console.log("Settings dumped to settings_dump.json");
    } catch (err) {
        console.error("❌ Dump failed:", err.message);
    } finally {
        pool.end();
    }
}

dumpSettings();
