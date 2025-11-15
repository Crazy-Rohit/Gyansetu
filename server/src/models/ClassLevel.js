const mongoose = require('mongoose');

const classLevelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // "Class 9"
    code: { type: String, required: true, unique: true }, // "9"
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClassLevel', classLevelSchema);
