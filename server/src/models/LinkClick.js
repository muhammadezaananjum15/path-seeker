import mongoose from 'mongoose';

const linkClickSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    sourcePage: {
      type: String,
      default: '/',
    },
    clickedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

linkClickSchema.index({ user: 1, clickedAt: -1 });

export const LinkClick = mongoose.model('LinkClick', linkClickSchema);
