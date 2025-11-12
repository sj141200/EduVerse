import express from 'express';
import crypto from 'crypto';
import multer from 'multer';

import Course from '../models/Course.js';
import Announcement from '../models/Announcement.js';
import Assignment from '../models/Assignment.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

function escapeRegExp(string) {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get enrolled courses for the authenticated user
router.get('/enrolled', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const courses = await Course.find({ $or: [{ students: user._id }, { teacher: user._id }] }).populate('teacher', 'name username');
    res.json(courses);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Create course
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, term } = req.body;
    const joinCode = crypto.randomBytes(4).toString('hex');
    const course = await Course.create({ title, term, teacher: req.user._id, joinCode, students: [] });
    res.json(course);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Fetch course details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name username');
    if (!course) return res.status(404).json({ error: 'Not found' });
    const announcements = await Announcement.find({ course: course._id }).sort({ createdAt: -1 });
    const assignments = await Assignment.find({ course: course._id }).sort({ createdAt: -1 });
    res.json({ course, announcements, assignments });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Update course
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updates = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Not found' });
    // only teacher can update
    if (!course.teacher.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
    Object.assign(course, updates);
    await course.save();
    res.json(course);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Generate new join code
router.post('/:id/generate-join-code', requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Not found' });
    if (!course.teacher.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
    course.joinCode = crypto.randomBytes(4).toString('hex');
    await course.save();
    res.json({ joinCode: course.joinCode });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Join course by id (authenticated student) - no code required (useful for direct join via course link)
router.post('/:id/join', requireAuth, async (req, res) => {
  try {
    // Accept either a Mongo ObjectId course id or several possible codes passed in the URL.
    const key = String(req.params.id || '').trim()
    console.debug(`[courses.join] attempt to join with key='${key}' by user=${req.user && req.user._id}`);
    let course = null;
    try {
      // try as an ObjectId first
      course = await Course.findById(key);
    } catch (castErr) {
      // ignore cast error and fall through to other lookups
    }
    if (!course) {
      // try common code fields the frontend may use: joinCode (hex), meta.classCode (frontend-generated)
      // perform case-insensitive matching so codes are tolerant to upper/lower input
      const re = new RegExp('^' + escapeRegExp(key) + '$', 'i')
      course = await Course.findOne({ $or: [ { joinCode: key }, { joinCode: { $regex: re } }, { 'meta.classCode': { $regex: re } } ] })
    }
    if (!course) {
      console.debug(`[courses.join] no course matched key='${key}'`);
      return res.status(404).json({ error: 'Not found' });
    }
    console.debug(`[courses.join] matched course._id='${course._id}', joinCode='${course.joinCode}', meta.classCode='${course.meta && course.meta.classCode}'`);
    // if user is not already a student, add them
    const uid = req.user._id;
    const already = course.students && course.students.some(s => String(s) === String(uid));
    if (!already) {
      course.students = course.students || [];
      course.students.push(uid);
      await course.save();
    }
    res.json({ success: true, courseId: course._id });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Resolve a course by id or code (public) - used when course links use frontend classCode
router.get('/resolve/:key', async (req, res) => {
  try {
    const key = String(req.params.key || '').trim();
    let course = null;
    try {
      course = await Course.findById(key).populate('teacher', 'name username');
    } catch (castErr) {
      // ignore
    }
    if (!course) {
      const re = new RegExp('^' + escapeRegExp(key) + '$', 'i')
      course = await Course.findOne({ $or: [ { joinCode: key }, { joinCode: { $regex: re } }, { 'meta.classCode': { $regex: re } } ] }).populate('teacher', 'name username')
    }
    if (!course) return res.status(404).json({ error: 'Not found' });

    const announcements = await Announcement.find({ course: course._id }).sort({ createdAt: -1 });
    const assignments = await Assignment.find({ course: course._id }).sort({ createdAt: -1 });
    res.json({ course, announcements, assignments });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Join by code
router.post('/join', requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const re = new RegExp('^' + escapeRegExp(String(code || '')) + '$', 'i')
    const course = await Course.findOne({ $or: [ { joinCode: code }, { joinCode: { $regex: re } } ] });
    if (!course) return res.status(400).json({ success: false, error: 'Invalid join code' });
    if (!course.students.includes(req.user._id)) {
      course.students.push(req.user._id);
      await course.save();
    }
    res.json({ success: true, courseId: course._id });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Announcements: list/create/delete
router.get('/:id/announcements', requireAuth, async (req, res) => {
  try {
    const anns = await Announcement.find({ course: req.params.id }).sort({ createdAt: -1 });
    res.json(anns);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/:id/announcements', requireAuth, async (req, res) => {
  try {
    const { title, body } = req.body;
    const ann = await Announcement.create({ course: req.params.id, title, body, author: req.user._id });
    res.json(ann);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id/announcements/:annId', requireAuth, async (req, res) => {
  try {
    await Announcement.deleteOne({ _id: req.params.annId, course: req.params.id });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Assignments
router.get('/:id/assignments', requireAuth, async (req, res) => {
  try {
    const as = await Assignment.find({ course: req.params.id }).sort({ createdAt: -1 });
    res.json(as);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/:id/assignments', requireAuth, async (req, res) => {
  try {
    const payload = { ...req.body, course: req.params.id };
    const a = await Assignment.create(payload);
    res.json(a);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Submit to assignment
router.post('/:id/assignments/:assignmentId/submit', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    const submission = { student: req.user._id, content: { text: req.body.text || null, file: req.file ? { path: req.file.path, originalname: req.file.originalname } : null }, uploadedAt: new Date() };
    assignment.submissions.unshift(submission);
    await assignment.save();
    res.json(submission);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Get submissions for an assignment
router.get('/:id/assignments/:assignmentId/submissions', requireAuth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId).populate('submissions.student', 'username name');
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment.submissions || []);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Update assignment (grade or other updates)
router.put('/:id/assignments/:assignmentId', requireAuth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    // For simplicity, allow teacher of the course to update
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.teacher.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
    // Merge grading or other fields
    if (req.body.grading) {
      assignment.grading = { ...(assignment.grading || {}), ...req.body.grading };
      assignment.gradedAt = new Date();
    }
    // support other updates
    Object.keys(req.body).forEach(k => { if (k !== 'grading') assignment[k] = req.body[k]; });
    await assignment.save();
    res.json(assignment);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Files: upload/list/delete (basic)
router.get('/:id/files', requireAuth, async (req, res) => {
  try {
    // simple: store files in course.meta.files
    const course = await Course.findById(req.params.id);
    res.json((course && (course.meta && course.meta.files)) || []);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/:id/files', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const course = await Course.findById(req.params.id);
    const fileMeta = { id: crypto.randomBytes(6).toString('hex'), name: req.file.originalname, size: req.file.size, url: `/uploads/${req.file.filename}`, uploadedAt: new Date() };
    course.meta = course.meta || {};
    course.meta.files = course.meta.files || [];
    course.meta.files.unshift(fileMeta);
    await course.save();
    res.json(fileMeta);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id/files/:fileId', requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.meta || !course.meta.files) return res.json({ success: true });
    course.meta.files = course.meta.files.filter(f => f.id !== req.params.fileId);
    await course.save();
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

export default router;
