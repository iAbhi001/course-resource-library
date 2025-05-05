// backend/models/Submission.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
  assignment: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  // teacher’s written feedback
  comments: {
    type: String,
    trim: true,
    default: ''
  },
  // optional numeric grade between 0–100
  grade: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Submission
  || mongoose.model('Submission', submissionSchema);
