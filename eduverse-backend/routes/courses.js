import express from 'express';
import crypto from 'crypto';
import multer from 'multer';

import Course from '../models/Course.js';
import Announcement from '../models/Announcement.js';
import Assignment from '../models/Assignment.js';
import UploadedFile from '../models/UploadedFile.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadBuffer, deleteBlob, generateDownloadSas } from '../azureBlob.js';

const router = express.Router();
// Use memory storage so we can stream to Azure Blob directly
const upload = multer({ storage: multer.memoryStorage() });

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
    // include files metadata with short-lived download URLs when present
    const files = (course && course.meta && course.meta.files) || [];
    console.debug(`[courses.get] course=${course._id} meta.files.count=${files.length}`);
    const mappedFiles = await Promise.all(files.map(async (f) => {
      if (f && f.blobName) {
        try {
          const url = await generateDownloadSas(f.blobName, 30);
          return { ...f, downloadUrl: url };
        } catch (e) { return f; }
      }
      return f;
    }));
    res.json({ course, announcements, assignments, files: mappedFiles });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Update course details (title, term, meta, joinCode) - only teacher
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.teacher || String(course.teacher) !== String(req.user._id)) return res.status(403).json({ error: 'Forbidden' });

    const allowed = ['title', 'term', 'meta', 'joinCode'];
    allowed.forEach(k => {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) {
        if (k === 'meta' && typeof req.body.meta === 'object' && req.body.meta !== null) {
          course.meta = { ...(course.meta || {}), ...req.body.meta };
        } else {
          course[k] = req.body[k];
        }
      }
    });

    await course.save();
    const populated = await Course.findById(course._id).populate('teacher', 'name username');
    res.json(populated);
  } catch (e) {
    console.error('[courses.put] error', e && (e.message || e));
    res.status(500).json({ error: 'Server error' });
  }
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

// Grade a specific submission (teacher only)
router.put('/:id/assignments/:assignmentId/submissions/:submissionId', requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (!course.teacher || String(course.teacher) !== String(req.user._id)) return res.status(403).json({ error: 'Forbidden' });

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission) return res.status(404).json({ error: 'Submission not found' });

    // Accept grade and feedback in body
    const { grade, feedback } = req.body;
    if (typeof grade !== 'undefined') submission.grade = Number(grade);
    if (typeof feedback !== 'undefined') submission.feedback = String(feedback);
    submission.gradedAt = new Date();

    await assignment.save();
    // return the updated submission
    const updated = assignment.submissions.id(req.params.submissionId);
    res.json(updated);
  } catch (e) {
    console.error('[assignments.gradeSubmission] error', e && (e.message || e));
    res.status(500).json({ error: 'Server error' });
  }
});

// Files: upload/list/delete (basic)
router.get('/:id/files', requireAuth, async (req, res) => {
  try {
    // simple: store files in course.meta.files
    const course = await Course.findById(req.params.id);
    // For each file, if blobName present, generate a short-lived download URL
    const files = (course && (course.meta && course.meta.files)) || [];
    console.debug(`[courses.files] course=${req.params.id} files.length=${files.length}`);
    const mapped = await Promise.all(files.map(async (f) => {
      if (f && f.blobName) {
        try {
          const url = await generateDownloadSas(f.blobName, 30);
          return { ...f, downloadUrl: url };
        } catch (e) {
          return f;
        }
      }
      return f;
    }));
    res.json(mapped);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Admin/debug: list UploadedFile documents for a course (helps verify persistence)
router.get('/:id/uploaded-files', requireAuth, async (req, res) => {
  try {
    const docs = await UploadedFile.find({ course: req.params.id, deleted: { $ne: true } }).sort({ createdAt: -1 }).lean();
    res.json(docs);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});
router.post('/:id/files', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    // Create a blob name using course id + random suffix
    const blobName = `${req.params.id}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${req.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    // Upload buffer to Azure
    try {
      const up = await uploadBuffer(req.file.buffer, blobName, req.file.mimetype);
      // create an UploadedFile document
      const uploaded = await UploadedFile.create({
        filename: req.file.originalname,
        originalName: req.file.originalname,
        blobName,
        container: process.env.AZURE_STORAGE_CONTAINER || process.env.STORAGE_CONTAINER || undefined,
        url: up && up.url ? up.url : undefined,
        size: req.file.size,
        contentType: req.file.mimetype,
        uploader: req.user._id,
        uploaderRole: (req.user && req.user.role) ? req.user.role : 'other',
        course: course._id,
        assignment: req.body.assignmentId || null,
        materialType: req.body.materialType || 'course',
        metadata: req.body.metadata ? (typeof req.body.metadata === 'string' ? JSON.parse(req.body.metadata) : req.body.metadata) : undefined
      });

      // keep a lightweight reference in course.meta.files for backward compatibility
      const fileMeta = { id: String(uploaded._id), name: req.file.originalname, size: req.file.size, blobName, url: up && up.url ? up.url : undefined, uploadedAt: new Date(), uploader: req.user._id };
      course.meta = course.meta || {};
      course.meta.files = course.meta.files || [];
      course.meta.files.unshift(fileMeta);
      await course.save();

      // generate short-lived download URL
      const downloadUrl = await generateDownloadSas(blobName, 30);
      console.debug(`[courses.files] saved UploadedFile id=${uploaded._id} blobName=${blobName}`);
      res.json({ ...fileMeta, downloadUrl, uploadedFileId: String(uploaded._id) });
    } catch (e) {
      console.error('Azure upload failed', e);
      return res.status(500).json({ error: 'Upload failed' });
    }
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id/files/:fileId', requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // only teacher can delete
    if (!course.teacher || !course.teacher.equals(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const fileId = String(req.params.fileId || '');

    // 1) Try to find an UploadedFile doc by id
    let uploadedDoc = null;
    try { uploadedDoc = await UploadedFile.findById(fileId); } catch (e) { uploadedDoc = null }

    // 2) If not found, try to find a matching entry in course.meta.files
    let metaEntry = null;
    const filesArr = (course.meta && course.meta.files) || [];
    metaEntry = filesArr.find(f => f && (String(f.id || '') === fileId || String(f._id || '') === fileId || String(f.uploadedFileId || '') === fileId));

    // 3) Determine blobName to delete
    const blobName = (uploadedDoc && uploadedDoc.blobName) ? uploadedDoc.blobName : (metaEntry && metaEntry.blobName) ? metaEntry.blobName : null;

    // 4) Delete blob if available
    let blobDeleted = false;
    if (blobName) {
      try {
        await deleteBlob(blobName);
        blobDeleted = true;
      } catch (e) {
        console.error('[courses.delete] deleteBlob failed', e && (e.message || e));
      }
    }

    // 5) Remove UploadedFile document (hard delete) if present
    if (uploadedDoc) {
      try {
        await UploadedFile.deleteOne({ _id: uploadedDoc._id });
      } catch (e) {
        console.error('[courses.delete] Failed to remove UploadedFile doc', e && (e.message || e));
      }
    }

    // 6) Remove matching entries from course.meta.files (by id/_id/uploadedFileId/blobName)
    const before = filesArr.length;
    course.meta = course.meta || {};
    course.meta.files = (course.meta.files || []).filter(f => {
      if (!f) return true;
      if (String(f.id || '') === fileId) return false;
      if (String(f._id || '') === fileId) return false;
      if (String(f.uploadedFileId || '') === fileId) return false;
      if (blobName && String(f.blobName || '') === String(blobName)) return false;
      return true;
    });
    const after = course.meta.files.length;
    await course.save();

    return res.json({ success: true, removed: before - after, blobDeleted });
  } catch (e) {
    console.error('[courses.delete] unexpected error', e && (e.message || e));
    return res.status(500).json({ error: 'Server error' });
  }
});

// Generate a short-lived download URL for a specific file (authenticated)
router.get('/:id/files/:fileId/download', requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Authorization: allow teacher or enrolled students
    const uid = req.user && req.user._id;
    const isTeacher = course.teacher && String(course.teacher) === String(uid);
    const isStudent = Array.isArray(course.students) && course.students.some(s => String(s) === String(uid));
    if (!isTeacher && !isStudent) return res.status(403).json({ error: 'Forbidden' });

    // Try UploadedFile first
    let uploaded = null;
    try { uploaded = await UploadedFile.findById(req.params.fileId); } catch (e) { uploaded = null }

    // fallback to course.meta.files entry
    let blobName = null;
    if (uploaded && uploaded.blobName) blobName = uploaded.blobName;
    else {
      const files = (course && course.meta && course.meta.files) || [];
      const f = files.find(x => String(x.id) === String(req.params.fileId) || String(x._id) === String(req.params.fileId));
      if (f && f.blobName) blobName = f.blobName;
    }

    if (!blobName) return res.status(404).json({ error: 'File not found' });

    try {
      const url = await generateDownloadSas(blobName, 30);
      return res.json({ downloadUrl: url });
    } catch (e) {
      console.error('Failed to generate SAS', e);
      return res.status(500).json({ error: 'Failed to generate download URL' });
    }
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

export default router;
