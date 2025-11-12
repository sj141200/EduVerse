import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const AnnouncementSchema = new Schema({
  course: { type: Types.ObjectId, ref: 'Course', required: true },
  title: { type: String },
  body: { type: String },
  author: { type: Types.ObjectId, ref: 'User' },
  time: { type: Date, default: Date.now },
}, { timestamps: true });

export default model('Announcement', AnnouncementSchema);
