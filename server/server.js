import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { connectDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) throw new Error('MONGODB_URI and JWT_SECRET are required.');
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use(mongoSanitize());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(notFound);
app.use(errorHandler);

connectDatabase().then(() => app.listen(process.env.PORT || 5000, () => console.log(`API listening on port ${process.env.PORT || 5000}`))).catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
