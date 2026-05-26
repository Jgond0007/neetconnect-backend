const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  text: { type: String, required: true },
  aspirant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answer: { type: String },
  status: { type: String, enum: ['open', 'answered'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);