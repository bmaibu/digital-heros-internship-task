import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 40, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 8, select: false },
  },
  { timestamps: true },
);

adminSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Admin', adminSchema);
