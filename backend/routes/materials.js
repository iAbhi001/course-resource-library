const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const { uploadMaterial, getMaterials, emailMaterial } = require('../controllers/materialController');

const storage = multer.diskStorage({
  destination: (req,file,cb) => cb(null,'uploads/'),
  filename:    (req,file,cb) => cb(null,Date.now()+'-'+file.originalname)
});
const upload = multer({ storage });

router.post('/:courseId',           auth('teacher'), upload.single('file'), uploadMaterial);
router.get('/:courseId',            auth(),          getMaterials);
router.post('/:courseId/:materialId/email', auth('teacher'), emailMaterial);

module.exports = router;
