import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function updateTimes() {
    console.log("Connecting to database to update existing timestamps...");
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'modern_stack_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    const timeMapping = {
        'Hour 1': { start: '09:00 AM', end: '10:00 AM' },
        'Hour 2': { start: '10:00 AM', end: '11:00 AM' },
        'Hour 3': { start: '11:00 AM', end: '12:00 PM' },
        'Hour 4': { start: '12:00 PM', end: '01:00 PM' },
        'Hour 5': { start: '01:00 PM', end: '02:00 PM' },
        'Hour 6': { start: '02:00 PM', end: '03:00 PM' },
        'Hour 7': { start: '03:00 PM', end: '04:00 PM' },
        'Hour 8': { start: '04:00 PM', end: '05:00 PM' }
    };

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            for (const [hourSlot, times] of Object.entries(timeMapping)) {
                await connection.query(
                    'UPDATE hourly_production_entries SET start_time = ?, end_time = ? WHERE hour_slot = ?',
                    [times.start, times.end, hourSlot]
                );
            }

            await connection.commit();
            console.log("✅ Successfully updated existing records to 9 AM - 5 PM!");
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error("❌ Update failed:", err);
    } finally {
        pool.end();
    }
}

updateTimes();
