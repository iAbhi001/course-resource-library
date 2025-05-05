const router = require('express').Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/password-reset', forgotPassword);
router.post('/password-reset/confirm', resetPassword);

module.exports = router;
