import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ error: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ username, name: name || username, email, passwordHash: hash, role: role || 'student' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
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

export default router;
