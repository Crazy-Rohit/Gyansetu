const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    classLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassLevel',
      required: true,
    },
    name: { type: String, required: true }, // "Mathematics"
    code: { type: String, required: true }, // "MATH9", etc.
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
