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
  dueDate: { type: Date },
  submissions: [SubmissionSchema],
}, { timestamps: true });

export default model('Assignment', AssignmentSchema);
