import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, unique: true, lowercase: true, trim: true, required: true },
  password: { type: String, required: true, select: false }, // select:false keeps it hidden by default
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);