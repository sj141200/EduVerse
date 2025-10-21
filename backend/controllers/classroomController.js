import Classroom from "../models/Classroom.js";
import jwt from "jsonwebtoken";

export const createClassroom = async (req, res) => {
  try {
    // 1. Authenticate user (extract from JWT)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2. Generate unique code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 3. Create classroom
    const classroom = new Classroom({
      name: req.body.name,
      subject: req.body.subject,
      description: req.body.description,
      code,
      createdBy: userId,
      members: [userId],
    });

    await classroom.save();

    res.status(201).json({
      message: "Classroom created successfully",
      classroomCode: code,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// JOIN CLASSROOM
export const joinClassroom = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { code } = req.body;

    // Find classroom by code
    const classroom = await Classroom.findOne({ code });
    if (!classroom) {
      return res.status(404).json({ message: "Invalid classroom code" });
    }

    // Check if user already joined
    if (classroom.members.includes(userId)) {
      return res.status(400).json({ message: "Already joined this classroom" });
    }

    // Add user to classroom
    classroom.members.push(userId);
    await classroom.save();

    res.status(200).json({
      message: "Successfully joined classroom",
      classroomId: classroom._id,
      classroomName: classroom.name
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
