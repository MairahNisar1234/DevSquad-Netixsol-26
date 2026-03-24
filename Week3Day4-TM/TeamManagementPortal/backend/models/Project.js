import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  teamId: { type: String },
  members: [
    {
      memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
      task: String
    }
  ]
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);