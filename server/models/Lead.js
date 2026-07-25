import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    budget: { type: String, required: true, enum: ['<$500', '$500-$1000', '$1000-$5000', '>$5000'] },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  },
  { timestamps: true },
);

leadSchema.index({ name: 'text', email: 'text' });
leadSchema.index({ createdAt: -1 });

export default mongoose.model('Lead', leadSchema);
