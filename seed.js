import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function seedData() {
    console.log("Connecting to database...");
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password', // Update if necessary
        database: process.env.DB_NAME || 'modern_stack_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    const reportData = {
        report_date: '2026-02-08',
        department: 'Production',
        project_machine: 'EMAX-2 6.2 MOVABLE CONTACT WELDING MACHINE',
        shift: '1st and 2nd',
        prepared_by: 'Pavan Kumar M',
        total_planned_output: '1600 nos',
        total_actual_output: '1357 numbers',
        overall_output: '1357 numbers'
    };

    const entries = [
        { hour_slot: 'Hour 1', start_time: '09:00 AM', end_time: '10:00 AM', planned_output: '200', hourly_output: '170', cumulative_output: '170', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 2', start_time: '10:00 AM', end_time: '11:00 AM', planned_output: '200', hourly_output: '170', cumulative_output: '340', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 3', start_time: '11:00 AM', end_time: '12:00 PM', planned_output: '200', hourly_output: '170', cumulative_output: '510', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 4', start_time: '12:00 PM', end_time: '01:00 PM', planned_output: '200', hourly_output: '170', cumulative_output: '680', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 5', start_time: '01:00 PM', end_time: '02:00 PM', planned_output: '200', hourly_output: '170', cumulative_output: '850', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 6', start_time: '02:00 PM', end_time: '03:00 PM', planned_output: '200', hourly_output: '170', cumulative_output: '1020', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 7', start_time: '03:00 PM', end_time: '04:00 PM', planned_output: '200', hourly_output: '170', cumulative_output: '1190', downtime: '0', remarks: 'NA' },
        { hour_slot: 'Hour 8', start_time: '04:00 PM', end_time: '05:00 PM', planned_output: '200', hourly_output: '167', cumulative_output: '1357', downtime: '0', remarks: 'NA' }
    ];

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            console.log("Clearing old reports...");
            await connection.query('DELETE FROM hourly_production_entries');
            await connection.query('DELETE FROM production_reports');

            console.log("Inserting new report...");
            const [result] = await connection.query(
                'INSERT INTO production_reports (report_date, department, project_machine, shift, prepared_by, total_planned_output, total_actual_output, overall_output) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [reportData.report_date, reportData.department, reportData.project_machine, reportData.shift, reportData.prepared_by, reportData.total_planned_output, reportData.total_actual_output, reportData.overall_output]
            );

            const reportId = result.insertId;
            console.log("Report inserted with ID:", reportId);

            console.log("Inserting hourly entries...");
            for (const entry of entries) {
                await connection.query(
                    'INSERT INTO hourly_production_entries (report_id, hour_slot, start_time, end_time, planned_output, hourly_output, cumulative_output, downtime, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [reportId, entry.hour_slot, entry.start_time, entry.end_time, entry.planned_output, entry.hourly_output, entry.cumulative_output, entry.downtime, entry.remarks]
                );
            }

            await connection.commit();
            console.log("✅ Data seeded successfully!");
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        pool.end();
    }
}

seedData();
