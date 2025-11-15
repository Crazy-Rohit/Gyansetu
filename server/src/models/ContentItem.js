const mongoose = require('mongoose');

const contentItemSchema = new mongoose.Schema(
  {
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    type: {
      type: String,
      enum: ['lecture', 'note', 'test', 'book'],
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },

    // media/link fields
    thumbnailUrl: { type: String }, // for lectures
    youtubeUrl: { type: String },   // for lectures
    fileUrl: { type: String },      // pdf for notes/tests/books
    externalUrl: { type: String },  // google form, external book link, etc.

    durationMinutes: { type: Number }, // for lectures
    pagesCount: { type: Number },      // for notes/books
    maxMarks: { type: Number },        // for tests

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContentItem', contentItemSchema);
