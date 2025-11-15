const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    title: { type: String, required: true },
    chapterNumber: { type: Number }, // NCERT order
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chapter', chapterSchema);
