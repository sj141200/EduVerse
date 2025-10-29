const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  blobUrl: String,
  uploadedBy: String,
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
