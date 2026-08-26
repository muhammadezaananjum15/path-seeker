import mongoose from 'mongoose';

const multimediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeVideoId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['video', 'podcast'],
      default: 'video',
    },
    tags: {
      type: [String],
      default: [],
    },
    transcript: {
      type: String,
      default: '',
    },
    ratingAvg: {
      type: Number,
      default: 4.8,
    },
    ratingCount: {
      type: Number,
      default: 120,
    },
    careerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      default: null,
    },
    category: {
      type: String,
      default: 'Career Guide',
    },
    duration: {
      type: String,
      default: '15 min',
    },
  },
  {
    timestamps: true,
  }
);

export const Multimedia = mongoose.model('Multimedia', multimediaSchema);
