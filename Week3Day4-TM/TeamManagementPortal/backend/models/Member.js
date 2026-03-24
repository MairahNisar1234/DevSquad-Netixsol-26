import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Member' },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Member', memberSchema);