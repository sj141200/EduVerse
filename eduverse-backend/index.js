import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'EduVerse backend running' }));

async function start() {
  const mongo = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eduverse_dev';
  try {
    await mongoose.connect(mongo, { autoIndex: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
