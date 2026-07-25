import 'dotenv/config';
import { connectDatabase } from '../config/db.js';
import Admin from '../models/Admin.js';

await connectDatabase();
const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD in .env');
const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
if (existing) console.log('Admin already exists.');
else { await Admin.create({ username: ADMIN_USERNAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD }); console.log('Admin created successfully.'); }
process.exit(0);
