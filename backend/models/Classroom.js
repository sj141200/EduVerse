import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Classroom", classroomSchema);
