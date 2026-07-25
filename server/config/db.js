import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export async function connectDatabase() {
  mongoose.set('strictQuery', true);
  const uri = process.env.MONGODB_URI;
  
  if (uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
      await seedDefaultAdmin();
      return;
    } catch (error) {
      console.warn(`Could not connect to configured MONGODB_URI (${error.message}). Falling back to MongoMemoryServer.`);
    }
  }
  
  if (!mongoMemoryServer) {
    mongoMemoryServer = await MongoMemoryServer.create();
  }
  const memoryUri = mongoMemoryServer.getUri();
  await mongoose.connect(memoryUri);
  console.log(`MongoDB connected via MemoryServer: ${mongoose.connection.host}`);
  await seedDefaultAdmin();
}

async function seedDefaultAdmin() {
  try {
    const Admin = (await import('../models/Admin.js')).default;
    const { ADMIN_USERNAME = 'maibu', ADMIN_EMAIL = 'maibu@gmail.com', ADMIN_PASSWORD = 'Maibu123' } = process.env;
    const emailLower = ADMIN_EMAIL.toLowerCase();
    let existing = await Admin.findOne({ email: emailLower });
    if (!existing) {
      await Admin.create({ username: ADMIN_USERNAME, email: emailLower, password: ADMIN_PASSWORD });
      console.log(`Default admin seeded (${ADMIN_EMAIL})`);
    } else {
      existing.username = ADMIN_USERNAME;
      existing.password = ADMIN_PASSWORD;
      await existing.save();
      console.log(`Admin updated (${ADMIN_EMAIL})`);
    }
  } catch (err) {
    console.error('Failed to auto-seed default admin:', err.message);
  }
}



