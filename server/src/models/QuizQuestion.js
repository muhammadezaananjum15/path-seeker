import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  scoreMap: {
    technology: { type: Number, default: 0 },
    business: { type: Number, default: 0 },
    healthcare: { type: Number, default: 0 },
    design: { type: Number, default: 0 },
    engineering: { type: Number, default: 0 },
    law: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
  },
});

const quizQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Interests', 'Skills', 'Work Style', 'Values', 'Preferences'],
      default: 'Interests',
    },
    type: {
      type: String,
      enum: ['mcq', 'slider', 'likert'],
      default: 'mcq',
    },
    options: [optionSchema],
    weightage: {
      type: Number,
      default: 1,
    },
    targetRole: {
      type: String,
      enum: ['all', 'student', 'graduate', 'professional'],
      default: 'all',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
