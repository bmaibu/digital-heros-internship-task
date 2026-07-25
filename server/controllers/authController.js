import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

function tokenFor(admin) {
  return jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  return res.json({ token: tokenFor(admin), admin: { id: admin._id, username: admin.username, email: admin.email } });
}

export function me(req, res) {
  res.json({ admin: req.admin });
}
