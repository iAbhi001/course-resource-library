const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title:       { type: String, required: true },
  description: String,
  teacher:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  students:    [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
module.exports = Course;

