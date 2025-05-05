const Announcement = require('../models/Announcement');

exports.add = async (req, res, next) => {
  try {
    const ann = new Announcement({
      ...req.body, // { title, content, course? }
      postedBy: req.user._id
    });
    await ann.save();
    res.json(ann);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const anns = await Announcement.find()
      .populate('postedBy', 'name')
      .populate('course', 'title');
    res.json(anns);
  } catch (err) { next(err); }
};

exports.edit = async (req, res, next) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(
      req.params.announcementId,
      req.body,
      { new: true }
    );
    res.json(ann);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.announcementId);
    res.json({ msg: 'Deleted' });
  } catch (err) { next(err); }
};
