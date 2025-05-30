const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['student','teacher'], default: 'student' },
  resetToken: String,
  resetExpires: Date
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;

