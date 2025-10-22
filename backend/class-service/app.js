const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5001;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  retryWrites: false
})
.then(() => console.log("✅ Connected to Cosmos DB (Mongo API)"))
.catch(err => console.error("❌ Mongo connection error:", err.message));

// Example Class schema
const classSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacher: String
});
const Class = mongoose.model('Class', classSchema);

// Routes
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'class-service' }));

app.post('/classes', async (req, res) => {
  try {
    const cls = await Class.create(req.body);
    res.status(201).json(cls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/classes', async (req, res) => {
  const classes = await Class.find();
  res.json(classes);
});

app.listen(PORT, () => console.log(`🏫 class-service running on port ${PORT}`));
