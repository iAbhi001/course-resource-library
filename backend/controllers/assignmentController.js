// backend/controllers/assignmentController.js
const Assignment = require('../models/Assignment');

exports.createAssignment = async (req, res, next) => {
  try {
    const asn = new Assignment({
      ...req.body,                 // title, instructions, dueDate
      course: req.params.courseId
    });
    await asn.save();
    res.json(asn);
  } catch (err) {
    next(err);
  }
};

// list all assignments in a course
exports.getAssignments = async (req, res, next) => {
  try {
    const asns = await Assignment.find({ course: req.params.courseId });
    res.json(asns);
  } catch (err) {
    next(err);
  }
};

// **NEW**: fetch one assignment’s full details
exports.getAssignmentById = async (req, res, next) => {
  try {
    const asn = await Assignment.findById(req.params.assignmentId);
    if (!asn) return res.status(404).json({ msg: 'Assignment not found' });
    res.json(asn);
  } catch (err) {
    next(err);
  }
};
