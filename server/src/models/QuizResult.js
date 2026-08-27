import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizQuestion' },
        selectedOptions: [String],
      },
    ],
    domainScores: {
      technology: { type: Number, default: 0 },
      business: { type: Number, default: 0 },
      healthcare: { type: Number, default: 0 },
      design: { type: Number, default: 0 },
      engineering: { type: Number, default: 0 },
      law: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
    },
    overallScore: {
      type: Number,
      required: true,
    },
    recommendedCareers: [
      {
        careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career' },
        matchPercentage: Number,
        reason: String,
      },
    ],
    // Gemini-generated personalized analysis stored in MongoDB
    aiAnalysis: {
      type: String,
      default: '',
    },
    recommendedRole: {
      type: String,
      default: '',
    },
    takenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
