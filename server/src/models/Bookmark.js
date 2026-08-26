import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['career', 'video', 'resource', 'article'],
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

bookmarkSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
