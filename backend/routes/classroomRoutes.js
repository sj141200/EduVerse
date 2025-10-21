import express from "express";
import { createClassroom } from "../controllers/classroomController.js";

const router = express.Router();

// POST /api/classrooms/create
router.post("/create", createClassroom);

import { joinClassroom } from "../controllers/classroomController.js";
router.post("/join", joinClassroom);


export default router;

