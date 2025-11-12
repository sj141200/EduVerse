import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  teacher: { type: Types.ObjectId, ref: 'User' },
  term: { type: String },
  joinCode: { type: String },
  students: [{ type: Types.ObjectId, ref: 'User' }],
  meta: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default model('Course', CourseSchema);
