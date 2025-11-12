import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Announcement from '../models/Announcement.js';
import Assignment from '../models/Assignment.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWTSECRET || 'dev_secret_change_me';

// Generic register kept for backward compatibility (will accept role if provided)
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ error: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const createdRole = role === 'instructor' ? 'instructor' : 'student';
    const user = await User.create({ username, name: name || username, email, passwordHash: hash, role: createdRole });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Register endpoints for specific roles
router.post('/register/student', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ error: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ username, name: name || username, email, passwordHash: hash, role: 'student' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/register/instructor', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ error: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ username, name: name || username, email, passwordHash: hash, role: 'instructor' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Generic login - accepts optional 'role' field to enforce role matching
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    if (role && user.role !== role) return res.status(403).json({ error: `Role mismatch: user is a ${user.role}` });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Login endpoints for specific roles
router.post('/login/student', async (req, res) => {
  console.log("Student login attempt");
  console.log(req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    if (user.role !== 'student') return res.status(403).json({ error: `Role mismatch: user is a ${user.role}` });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

router.post('/login/instructor', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    if (user.role !== 'instructor') return res.status(403).json({ error: `Role mismatch: user is a ${user.role}` });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const u = req.user;
    res.json({ id: u._id, username: u.username, name: u.name, email: u.email, role: u.role });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Update current user profile
router.put('/users/me', requireAuth, async (req, res) => {
  try {
    const updates = req.body || {};
    const u = await User.findById(req.user._id);
    if (!u) return res.status(404).json({ error: 'User not found' });

    // Do NOT allow changing username via this endpoint (frontend shouldn't expose it)
    if (updates.username && updates.username !== u.username) {
      // ignore silently
      delete updates.username;
    }
    if (updates.email && updates.email !== u.email) {
      const exists = await User.findOne({ email: updates.email });
      if (exists) return res.status(400).json({ error: 'Email already taken' });
      u.email = updates.email;
    }
    if (updates.name) u.name = updates.name;
    // allow password change
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      u.passwordHash = await bcrypt.hash(updates.password, salt);
    }
    await u.save();
    res.json({ id: u._id, username: u.username, name: u.name, email: u.email, role: u.role });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Delete current user account. If instructor, delete their courses and related data.
router.delete('/users/me', requireAuth, async (req, res) => {
  try {
    const u = await User.findById(req.user._id);
    if (!u) return res.status(404).json({ error: 'User not found' });

    if (u.role === 'instructor') {
      // find courses taught by this instructor
      const courses = await Course.find({ teacher: u._id });
      const courseIds = courses.map(c => c._id);
      // delete announcements and assignments tied to these courses
      await Announcement.deleteMany({ course: { $in: courseIds } });
      await Assignment.deleteMany({ course: { $in: courseIds } });
      // delete the courses themselves
      await Course.deleteMany({ teacher: u._id });
    }

    // Remove user from students arrays in other courses
    await Course.updateMany({ students: u._id }, { $pull: { students: u._id } });

    // finally delete user
    await User.deleteOne({ _id: u._id });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Public: fetch a user's public profile by id
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('username name role');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, username: user.username, name: user.name, role: user.role });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

export default router;
