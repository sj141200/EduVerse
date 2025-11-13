import mongoose from 'mongoose';

const { Schema } = mongoose;

// Model: UploadedFile
// Stores metadata for files uploaded to Azure Blob Storage (or other providers).
// Fields capture the original filename, the storage identifier (blobName/accessId),
// uploader reference and role, relation to Course or Assignment, and optional metadata.
const UploadedFileSchema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  // Primary storage identifier (blob path or id inside the storage container)
  blobName: { type: String, required: true, index: true, unique: true },
  // Optional storage container name (if your setup uses multiple containers)
  container: { type: String },
  // Optional publicly accessible URL (or last-known URL). Not required when using SAS URLs.
  url: { type: String },
  // Size in bytes
  size: { type: Number },
  // MIME type
  contentType: { type: String },
  // Reference to uploader
  uploader: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  // Role of the uploader at time of upload (instructor, student, admin, etc.)
  uploaderRole: { type: String, enum: ['instructor', 'student',], default: 'instructor' },
  // Which course this file belongs to (if applicable)
  course: { type: Schema.Types.ObjectId, ref: 'Course', index: true },
  // If the file is related to an assignment, point to it
  assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', default: null },
  // Material type helps categorize the file for UI/filtering
  materialType: { type: String, enum: ['course', 'assignment', 'submission', 'resource', 'other'], default: 'course' },
  // Optional free-form metadata (uploader notes, tags)
  metadata: { type: Schema.Types.Mixed },
  // Soft-delete flag and timestamp
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

// Indexes for common queries
UploadedFileSchema.index({ course: 1, createdAt: -1 });
UploadedFileSchema.index({ uploader: 1, createdAt: -1 });

export default mongoose.model('UploadedFile', UploadedFileSchema);
