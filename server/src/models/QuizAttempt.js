import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: false,
    },
    quizTitle: {
      type: String,
      default: 'Comprehensive Career Aptitude Assessment',
    },
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 10,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({ user: 1, createdAt: -1 });

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
