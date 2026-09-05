import mongoose from 'mongoose';

const pageActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    page: {
      type: String,
      required: true,
      index: true,
    },
    enteredAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    exitedAt: {
      type: Date,
    },
    durationMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

pageActivitySchema.index({ user: 1, enteredAt: -1 });

export const PageActivity = mongoose.model('PageActivity', pageActivitySchema);
