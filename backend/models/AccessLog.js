const mongoose = require('mongoose');
const AccessLog = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String, // view/download
  ip: String
}, { timestamps:true });
module.exports = mongoose.model('AccessLog', AccessLog);
