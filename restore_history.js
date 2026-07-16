import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function restoreHistoricalData() {
    console.log("Connecting to database to restore historical reports...");
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'modern_stack_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // The historical reports from the screenshot
    const historicalReports = [
        {
            report_date: '2026-03-02', // 2/3/2026 in DD/MM/YYYY format based on screenshot
            department: 'Production',
            project_machine: 'EMAX-2 6.2 MOVABLE CONTACT WELDING MACHINE',
            shift: '1st and 2nd',
            prepared_by: 'Pavan Kumar M',
            total_planned_output: '1600 nos',
            total_actual_output: '980 nos',
            overall_output: '980 nos'
        },
        {
            report_date: '2026-02-26', // 26/2/2026
            department: 'Production',
            project_machine: 'EMAX-2 6.2 MOVABLE CONTACT WELDING MACHINE',
            shift: '1st and 2nd',
            prepared_by: 'Pavan Kumar M',
            total_planned_output: '1600 nos',
            total_actual_output: '955 nos',
            overall_output: '955 nos'
        },
        {
            report_date: '2026-02-23', // 23/2/2026
            department: 'Production',
            project_machine: 'EMAX-2 6.2 MOVABLE CONTACT WELDING MACHINE',
            shift: '1st and 2nd',
            prepared_by: 'Pavan Kumar M',
            total_planned_output: '1600 nos',
            total_actual_output: '422 nos',
            overall_output: '422 nos'
        },
        {
            report_date: '2026-02-20', // 20/2/2026
            department: 'Production',
            project_machine: 'EMAX-2 6.2 MOVABLE CONTACT WELDING MACHINE',
            shift: '1st and 2nd',
            prepared_by: 'Pavan Kumar M',
            total_planned_output: '1600 nos',
            total_actual_output: '178 nos',
            overall_output: '178 nos'
        },
        {
            report_date: '2026-02-19', // 19/2/2026
            department: 'Production',
            project_machine: 'EMAX-2 6.2 MOVABLE CONTACT WELDING MACHINE',
            shift: '1st and 2nd',
            prepared_by: 'Pavan Kumar M',
            total_planned_output: '1600 nos',
            total_actual_output: '976 nos',
            overall_output: '976 nos'
        },
        {
            report_date: '2026-02-18', // 18/2/2026
            department: 'Production',
            project_machine: 'EMAX-2 6.2 MOVABLE CONTACT WELDING MACHINE',
            shift: '1st and 2nd',
            prepared_by: 'Pavan Kumar M',
            total_planned_output: '1600 nos',
            total_actual_output: '712 nos',
            overall_output: '712 nos'
        }
    ];

    // Dummy entries with the newly updated 9 AM to 5 PM times to fulfill constraints since exact hourly data isn't in screenshot
    const dummyEntries = [
        { hour_slot: 'Hour 1', start_time: '09:00 AM', end_time: '10:00 AM', planned_output: '200', hourly_output: 'NA', cumulative_output: 'NA', downtime: 'NA', remarks: 'Restored from history without hourly detail' },
        { hour_slot: 'Hour 2', start_time: '10:00 AM', end_time: '11:00 AM', planned_output: '200', hourly_output: 'NA', cumulative_output: 'NA', downtime: 'NA', remarks: 'NA' },
        { hour_slot: 'Hour 3', start_time: '11:00 AM', end_time: '12:00 PM', planned_output: '200', hourly_output: 'NA', cumulative_output: 'NA', downtime: 'NA', remarks: 'NA' },
        { hour_slot: 'Hour 4', start_time: '12:00 PM', end_time: '01:00 PM', planned_output: '200', hourly_output: 'NA', cumulative_output: 'NA', downtime: 'NA', remarks: 'NA' },
        { hour_slot: 'Hour 5', start_time: '01:00 PM', end_time: '02:00 PM', planned_output: '200', hourly_output: 'NA', cumulative_output: 'NA', downtime: 'NA', remarks: 'NA' },
        { hour_slot: 'Hour 6', start_time: '02:00 PM', end_time: '03:00 PM', planned_output: '200', hourly_output: 'NA', cumulative_output: 'NA', downtime: 'NA', remarks: 'NA' },
        { hour_slot: 'Hour 7', start_time: '03:00 PM', end_time: '04:00 PM', planned_output: '200', hourly_output: 'NA', cumulative_output: 'NA', downtime: 'NA', remarks: 'NA' },
        { hour_slot: 'Hour 8', start_time: '04:00 PM', end_time: '05:00 PM', planned_output: '200', hourly_output: 'NA', cumulative_output: 'NA', downtime: 'NA', remarks: 'NA' }
    ];

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            console.log("Restoring historical records...");
            for (const report of historicalReports) {
                const [result] = await connection.query(
                    'INSERT INTO production_reports (report_date, department, project_machine, shift, prepared_by, total_planned_output, total_actual_output, overall_output) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [report.report_date, report.department, report.project_machine, report.shift, report.prepared_by, report.total_planned_output, report.total_actual_output, report.overall_output]
                );

                const reportId = result.insertId;

                // Insert the dummy hourly entries 
                for (let i = 0; i < dummyEntries.length; i++) {
                    const entry = dummyEntries[i];

                    // Put the daily total into the 8th hour's cumulative output so graphs / calculations don't break
                    const cumulative = i === 7 ? report.total_actual_output : 'NA';

                    await connection.query(
                        'INSERT INTO hourly_production_entries (report_id, hour_slot, start_time, end_time, planned_output, hourly_output, cumulative_output, downtime, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [reportId, entry.hour_slot, entry.start_time, entry.end_time, entry.planned_output, entry.hourly_output, cumulative, entry.downtime, entry.remarks]
                    );
                }
            }

            await connection.commit();
            console.log("✅ Historical data restored successfully!");
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

restoreHistoricalData();
