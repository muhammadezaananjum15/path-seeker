import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    domain: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    storyText: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    timeline: [
      {
        year: String,
        title: String,
        description: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

successStorySchema.index({ status: 1, createdAt: -1 });
successStorySchema.index({ createdAt: -1 });

export const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
