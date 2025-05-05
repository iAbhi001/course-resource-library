const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
  title:      String,
  fileUrl:    String,
  course:     { type: Schema.Types.ObjectId, ref: 'Course' },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Material = mongoose.models.Material || mongoose.model('Material', materialSchema);
module.exports = Material;

