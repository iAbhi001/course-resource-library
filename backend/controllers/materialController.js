const Material = require('../models/Material');
const transporter = require('../config/mailer');
const User = require('../models/User');

exports.uploadMaterial = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file' });
    const mat = new Material({
      title: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      course: req.params.courseId,
      uploadedBy: req.user._id
    });
    await mat.save();
    res.json(mat);
  } catch (err) { next(err); }
};

exports.getMaterials = async (req, res, next) => {
  try {
    const mats = await Material.find({ course: req.params.courseId });
    res.json(mats);
  } catch (err) { next(err); }
};

exports.emailMaterial = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const { studentIds } = req.body; // [id,...]
    const material = await Material.findById(materialId);
    const students = await User.find({ _id: { $in: studentIds } });

    await Promise.all(students.map(s =>
      transporter.sendMail({
        to: s.email,
        subject: `New Material: ${material.title}`,
        html: `<p><a href="${req.protocol}://${req.get('host')}${material.fileUrl}">${material.title}</a></p>`
      })
    ));
    res.json({ msg: 'Emails sent' });
  } catch (err) { next(err); }
};
