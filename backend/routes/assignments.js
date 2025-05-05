// backend/routes/assignments.js
const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const {
  createAssignment,
  getAssignments,
  getAssignmentById
} = require('../controllers/assignmentController');

// 1) create → POST /api/assignments/:courseId
router.post('/:courseId', auth('teacher'), createAssignment);

// 2) details → GET /api/assignments/:assignmentId/details
router.get('/:assignmentId/details', auth(), getAssignmentById);

// 3) list assignments in a course → GET /api/assignments/:courseId
router.get('/:courseId', auth(), getAssignments);

module.exports = router;
