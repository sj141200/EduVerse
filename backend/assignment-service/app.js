const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5003;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  retryWrites: false
})
.then(() => console.log("✅ Connected to Cosmos DB (Mongo API)"))
.catch(err => console.error("❌ Mongo connection error:", err.message));

// Discussion schema
const discussionSchema = new mongoose.Schema({
  classId: String,
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Discussion = mongoose.model('Discussion', discussionSchema);

// Routes
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'discussion-service' }));

app.post('/discussions', async (req, res) => {
  try {
    const discussion = await Discussion.create(req.body);
    res.status(201).json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/discussions', async (req, res) => {
  const discussions = await Discussion.find();
  res.json(discussions);
});

app.listen(PORT, () => console.log(`💬 discussion-service running on port ${PORT}`));
