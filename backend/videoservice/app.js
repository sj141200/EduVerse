const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const videoRoutes = require('./routes/video');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { ssl: true })
  .then(() => console.log('✅ Connected to Cosmos DB (Mongo API)'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/videos', videoRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'video-service' }));

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`🎥 video-service running on port ${PORT}`));
