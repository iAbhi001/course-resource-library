// backend/controllers/courseController.js
const Course = require('../models/Course');
const User   = require('../models/User');

exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, students = [] } = req.body;
    
    // Only accept real student IDs
    const validStudents = await User.find({
      _id: { $in: students },
      role: 'student'
    }).distinct('_id');

    const course = new Course({
      title,
      description,
      teacher:  req.user._id,
      students: validStudents
    });
    await course.save();

    // Populate before returning
    await course.populate('teacher',  'name email');
    await course.populate('students', 'name email');

    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    let query;
    if (req.user.role === 'teacher') {
      query = Course.find({ teacher: req.user._id });
    } else {
      query = Course.find({ students: req.user._id });
    }

    const courses = await query
      .populate('teacher',  'name email')
      .populate('students', 'name email');

    res.json(courses);
  } catch (err) {
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('teacher',  'name email')
      .populate('students', 'name email');

    if (!course) 
      return res.status(404).json({ msg: 'Course not found' });

    // Students can only see their own courses
    if (
      req.user.role === 'student' &&
      !course.students.some(s => s._id.equals(req.user._id))
    ) {
      return res.status(403).json({ msg: 'Not enrolled in this course' });
    }

    res.json(course);
  } catch (err) {
    next(err);
  }
};

exports.enrollStudent = async (req, res, next) => {
  try {
    const { courseId }  = req.params;
    const { studentId } = req.body;

    const [course, user] = await Promise.all([
      Course.findById(courseId),
      User.findOne({ _id: studentId, role: 'student' })
    ]);

    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (!user)   return res.status(404).json({ msg: 'Student not found' });

    if (!course.students.includes(studentId)) {
      course.students.push(studentId);
      await course.save();
    }

    await course.populate('students', 'name email');
    res.json(course);
  } catch (err) {
    next(err);
  }
};

exports.unenrollStudent = async (req, res, next) => {
  try {
    const { courseId, studentId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    course.students = course.students.filter(
      id => id.toString() !== studentId
    );
    await course.save();
    await course.populate('students', 'name email');
    res.json(course);
  } catch (err) {
    next(err);
  }
};

/**
 * Bulk‐replace the enrolled students list.
 * Expects: { studentIds: [<id1>,<id2>,…] }
 */
exports.updateStudents = async (req, res, next) => {
  try {
    const { courseId }   = req.params;
    const { studentIds } = req.body; // array of IDs

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Keep only valid student IDs
    const validStudents = await User.find({
      _id: { $in: studentIds },
      role: 'student'
    }).distinct('_id');

    course.students = validStudents;
    await course.save();
    await course.populate('students', 'name email');

    res.json(course);
  } catch (err) {
    next(err);
  }
};
