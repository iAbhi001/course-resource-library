const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { add, getAll, edit, remove } = require('../controllers/announcementController');

router.post('/',                   auth('teacher'), add);
router.get('/',                    auth(),          getAll);
router.put('/:announcementId',     auth('teacher'), edit);
router.delete('/:announcementId',  auth('teacher'), remove);

module.exports = router;
