const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['aspirant', 'mentor', 'admin'], default: 'aspirant' },
  targetYear: { type: String },
  subject: { type: String },
  neetScore: { type: String },
  status: { type: String, enum: ['active', 'pending', 'banned'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);