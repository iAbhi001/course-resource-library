// backend/routes/submissions.js

const router = require('express').Router();
const multer = require('multer');
const auth   = require('../middleware/authMiddleware');
const {
  submit,
  review,
  getAllSubmissions,
  getByAssignment,  // ← your new student‑view route
  getOne           // ← your new single‑submission route
} = require('../controllers/submissionController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 1) Teacher: list all subs in their courses
router.get(
  '/',
  auth('teacher'),
  getAllSubmissions
);

// 2) Student: upload a submission
router.post(
  '/:assignmentId',
  auth('student'),
  upload.single('file'),
  submit
);

// ← NEW 3) Student: list their own submission(s) for a given assignment
router.get(
  '/assignment/:assignmentId',
  auth('student'),
  getByAssignment
);

// ← NEW 4) Student/Teacher: fetch one submission (with feedback)
router.get(
  '/:submissionId',
  auth(),        // both roles can view, controller will enforce
  getOne
);

// 5) Teacher: review (add comments & grade)
router.put(
  '/:submissionId',
  auth('teacher'),
  review
);

module.exports = router;
