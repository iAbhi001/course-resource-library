const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  title:        String,
  instructions: String,
  dueDate:      Date,
  course:       { type: Schema.Types.ObjectId, ref: 'Course' }
}, { timestamps: true });

const Assignment = mongoose.models.Assignment
  || mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
