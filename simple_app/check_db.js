import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkData() {
    console.log("Checking database records...");
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'modern_stack_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        const [reports] = await pool.query('SELECT id, report_date, total_actual_output FROM production_reports');
        console.log("\n--- Reports in DB ---");
        console.table(reports);

        const [entries] = await pool.query('SELECT * FROM hourly_production_entries WHERE cumulative_output != "NA" LIMIT 15');
        console.log("\n--- Hourly Entries in DB (Sample) ---");
        console.table(entries);

    } catch (err) {
        console.error("❌ Check failed:", err);
    } finally {
        pool.end();
    }
}

checkData();
