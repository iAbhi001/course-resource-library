// backend/routes/users.js
const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const { getUsers } = require('../controllers/userController');

// only teachers need this, but you could open it up to auth()
router.get('/', auth('teacher'), getUsers);

module.exports = router;
