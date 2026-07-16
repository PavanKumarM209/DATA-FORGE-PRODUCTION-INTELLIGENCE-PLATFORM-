import nodemailer from 'nodemailer';
import { initDB } from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
    console.log("Starting email test...");
    try {
        await initDB();

        // Remove spaces from password if any
        const pass = (process.env.EMAIL_PASS || '').replace(/\s/g, '');

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: pass
            }
        });

        console.log("Attempting to send email to:", process.env.ADMIN_EMAIL);

        const result = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || 'pavankumarm209@gmail.com',
            subject: 'Test Email from ABB Dashboard (Port 465)',
            text: 'This is a test email to verify SMTP configuration on port 465.'
        });

        console.log("✅ Email sent successfully!");
        console.log("Info:", result.response);
    } catch (err) {
        console.error("❌ Email failed:", err.message);
        if (err.stack) console.error(err.stack);
    }
}

testEmail();
