import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function restoreMarchSecondData() {
    console.log("Connecting to database to perfectly restore the March 2nd report data...");
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'modern_stack_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    const entries = [
        { hour_slot: 'Hour 1', start_time: '10:00 AM', end_time: '11:00 AM', planned_output: '200', hourly_output: '125', cumulative_output: '125', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 2', start_time: '11:00 AM', end_time: '12:00 PM', planned_output: '150', hourly_output: '113', cumulative_output: '238', downtime: '15', remarks: 'NA' },
        { hour_slot: 'Hour 3', start_time: '12:00 PM', end_time: '01:00 PM', planned_output: '100', hourly_output: '57', cumulative_output: '295', downtime: '30', remarks: 'NA' },
        { hour_slot: 'Hour 4', start_time: '01:00 PM', end_time: '01:30 PM', planned_output: '200', hourly_output: '167', cumulative_output: '462', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 5', start_time: '01:30 PM', end_time: '03:00 PM', planned_output: '200', hourly_output: '173', cumulative_output: '635', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 6', start_time: '03:00 PM', end_time: '04:00 PM', planned_output: '200', hourly_output: '93', cumulative_output: '728', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 7', start_time: '04:00 PM', end_time: '05:00 PM', planned_output: '200', hourly_output: '103', cumulative_output: '831', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 8', start_time: '05:00 PM', end_time: '06:00 PM', planned_output: '200', hourly_output: '149', cumulative_output: '980', downtime: '0', remarks: 'NA' }
    ];

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Find the report id for 2/3/2026 (2026-03-02)
            const [report] = await connection.query(
                "SELECT id FROM production_reports WHERE report_date = '2026-03-02' LIMIT 1"
            );

            if (report.length > 0) {
                const reportId = report[0].id;

                // Make sure totals match the screenshot
                await connection.query(
                    'UPDATE production_reports SET total_planned_output = ?, total_actual_output = ?, overall_output = ? WHERE id = ?',
                    ['1450', '980', '980', reportId]
                );

                // Update the entries for this report id
                console.log("Updating entries for report ID:", reportId);

                for (const entry of entries) {
                    await connection.query(
                        'UPDATE hourly_production_entries SET start_time = ?, end_time = ?, planned_output = ?, hourly_output = ?, cumulative_output = ?, downtime = ? WHERE report_id = ? AND hour_slot = ?',
                        [entry.start_time, entry.end_time, entry.planned_output, entry.hourly_output, entry.cumulative_output, entry.downtime, reportId, entry.hour_slot]
                    );
                }

                await connection.commit();
                console.log("✅ March 2nd Report details restored successfully!");

            } else {
                console.log("❌ Could not find March 2nd report.");
            }
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error("❌ Restore failed:", err);
    } finally {
        pool.end();
    }
}

restoreMarchSecondData();
