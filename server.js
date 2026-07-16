import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Configurations & Services
import { initDB } from './config/db.js';
import { initRedis } from './config/redis.js';
import { setupMailer } from './services/emailService.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// General API Rate Limiting
app.use('/api', apiLimiter);

// Health check route
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'API is running optimally.' });
});

// Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

// TEMPORARY: View all admins route (for debugging)
app.get('/api/admins', async (req, res) => {
  try {
    const { getPool } = await import('./config/db.js');
    const pool = getPool();
    // ONLY FOR DEBUGGING. Do not keep in production.
    const [rows] = await pool.query('SELECT id, name, email FROM admins ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

// Initialize critical subsystems before listening
async function startServer() {
  try {
    console.log("🛠️ Starting backend server initialization...");
    await initDB();
    console.log("🗄️ Database initialized.");

    await initRedis();
    console.log("🧊 Redis initialization attempt completed.");

    await setupMailer();
    console.log("📧 Mailer setup completed.");

    app.listen(PORT, () => {
      console.log(`🚀 Backend server is running on http://localhost:${PORT} with SOLID architecture.`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
