const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
  title: String,
  description: String,
  authors: [String],
  categories: [String],
  s3Key: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  size: Number
}, { timestamps:true });
module.exports = mongoose.model('Book', BookSchema);
