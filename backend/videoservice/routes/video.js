import express from "express";
import multer from "multer";
import { uploadVideo, listVideos, streamVideo } from "../controllers/videoController.js";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("video"), uploadVideo);
router.get("/list", listVideos);
router.get("/stream/:filename", streamVideo);

export default router;
