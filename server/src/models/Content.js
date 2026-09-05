import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
      index: true,
    },
    body: {
      type: String,
      required: [true, 'Content body is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      default: 'Article',
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readTimeMinutes: {
      type: Number,
      default: 5,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ title: 'text', body: 'text', tags: 'text' });
contentSchema.index({ status: 1, createdAt: -1 });
contentSchema.index({ category: 1, createdAt: -1 });
contentSchema.index({ createdAt: -1 });

export const Content = mongoose.model('Content', contentSchema);
