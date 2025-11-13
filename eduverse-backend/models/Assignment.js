import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const SubmissionSchema = new Schema({
  student: { type: Types.ObjectId, ref: 'User' },
  content: { type: Schema.Types.Mixed },
  uploadedAt: { type: Date, default: Date.now },
  grade: { type: Number },
  feedback: { type: String },
}, { _id: true });

const AssignmentSchema = new Schema({
  course: { type: Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  // due can be stored as a human-friendly string (used by frontend) and
  // dueDate as an actual Date where available.
  due: { type: String },
  dueDate: { type: Date },
  // totalPoints is the max points possible for the assignment
  totalPoints: { type: Number },
  // optional assignment-level grade (summary or default) — per-student grades are stored on submissions
  grade: { type: Number },
  submissions: [SubmissionSchema],
}, { timestamps: true });

export default model('Assignment', AssignmentSchema);
