// backend/controllers/submissionController.js

const Submission = require('../models/Submission');
const Course     = require('../models/Course');
const Assignment = require('../models/Assignment');

exports.submit = async (req, res, next) => {
  try {
    if (!req.file) 
      return res.status(400).json({ msg: 'No file' });

    const sub = new Submission({
      assignment: req.params.assignmentId,
      student:    req.user._id,
      fileUrl:    `/uploads/${req.file.filename}`
    });
    await sub.save();

    res.json(sub);
  } catch (err) {
    next(err);
  }
};

exports.review = async (req, res, next) => {
  try {
    const { comments, grade } = req.body;

    // 1) fetch the submission
    const sub = await Submission.findById(req.params.submissionId);
    if (!sub) 
      return res.status(404).json({ msg: 'Submission not found' });

    // 2) ensure this teacher owns the course for that assignment
    const asn = await Assignment.findById(sub.assignment);
    if (!asn) 
      return res.status(404).json({ msg: 'Assignment not found' });

    const course = await Course.findById(asn.course);
    if (!course) 
      return res.status(404).json({ msg: 'Course not found' });

    if (!course.teacher.equals(req.user._id)) {
      return res.status(403).json({ msg: 'Not authorized to review this submission' });
    }

    // 3) save feedback
    sub.comments = comments;
    sub.grade    = grade;
    await sub.save();

    // 4) re-populate and return
    const updated = await Submission.findById(sub._id)
      .populate('student','name email')
      .populate('assignment','title');

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ← NEW: list only the logged-in student’s submission(s) for a given assignment
exports.getByAssignment = async (req, res, next) => {
  try {
    const subs = await Submission.find({
      assignment: req.params.assignmentId,
      student:    req.user._id
    })
    .populate('assignment','title')
    .sort('-createdAt');

    res.json(subs);
  } catch (err) {
    next(err);
  }
};

// ← NEW: fetch a single submission (student can see own; teacher can see any in their courses)
exports.getOne = async (req, res, next) => {
  try {
    const sub = await Submission.findById(req.params.submissionId)
      .populate('student','name email')
      .populate('assignment','title');

    if (!sub) 
      return res.status(404).json({ msg: 'Submission not found' });

    if (req.user.role === 'student') {
      if (!sub.student._id.equals(req.user._id)) {
        return res.status(403).json({ msg: 'Not your submission' });
      }
      return res.json(sub);
    }

    // if teacher: verify they own the course
    const asn = await Assignment.findById(sub.assignment);
    const course = await Course.findById(asn.course);
    if (!course.teacher.equals(req.user._id)) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(sub);
  } catch (err) {
    next(err);
  }
};

exports.getAllSubmissions = async (req, res, next) => {
  try {
    // 1. find courses taught by this teacher
    const courseIds = await Course.find({ teacher: req.user._id }).distinct('_id');
    // 2. find assignments in those courses
    const assignmentIds = await Assignment.find({
      course: { $in: courseIds }
    }).distinct('_id');
    // 3. fetch submissions for those assignments
    const submissions = await Submission.find({
      assignment: { $in: assignmentIds }
    })
      .populate('student', 'name email')
      .populate('assignment', 'title')
      .sort('-createdAt');

    res.json(submissions);
  } catch (err) {
    next(err);
  }
};
