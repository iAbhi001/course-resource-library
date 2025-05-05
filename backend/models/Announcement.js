const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
  title:    String,
  content:  String,
  course:   { type: Schema.Types.ObjectId, ref: 'Course', default: null },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
// after defining announcementSchema...
const Announcement = mongoose.models.Announcement
  || mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;

