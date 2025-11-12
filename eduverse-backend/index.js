
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import { getSecret } from './keyVault.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Allow CORS requests and allow credentials for cross-site requests
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'EduVerse backend running' }));

async function start() {
  try {
    // Fetch MongoDB URI from Azure Key Vault
    const mongo = await getSecret('MONGOURI');
    await mongoose.connect(mongo, { autoIndex: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
