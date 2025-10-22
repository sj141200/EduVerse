const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('express')();
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      retryWrites: false
    });
    console.log("✅ Connected to Cosmos DB (MongoDB API)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
})();

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'user-service' }));

app.listen(PORT, () => console.log(`user-service listening on port ${PORT}`));
