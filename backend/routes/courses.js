// backend/routes/courses.js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const {
  createCourse,
  getCourses,
  getCourse,
  enrollStudent,
  unenrollStudent,
  updateStudents      // ← our new bulk replace handler
} = require('../controllers/courseController');

// 1) Create a new course
//    POST /api/courses
router.post(
  '/',
  auth('teacher'),
  createCourse
);

// 2) List courses (teacher sees their own; student sees enrolled)
//    GET /api/courses
router.get(
  '/',
  auth(),
  getCourses
);

// 3) Get a single course (with students populated)
//    GET /api/courses/:courseId
router.get(
  '/:courseId',
  auth(),
  getCourse
);

// 4) Enroll one student
//    POST /api/courses/:courseId/students
router.post(
  '/:courseId/students',
  auth('teacher'),
  enrollStudent
);

// 5) Unenroll one student
//    DELETE /api/courses/:courseId/students/:studentId
router.delete(
  '/:courseId/students/:studentId',
  auth('teacher'),
  unenrollStudent
);

// 6) Replace the entire students list in one call
//    PUT /api/courses/:courseId/students
router.put(
  '/:courseId/students',
  auth('teacher'),
  updateStudents
);

module.exports = router;
