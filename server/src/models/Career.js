import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
      index: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    educationPath: {
      type: String,
      required: true,
    },
    expectedSalaryRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    demandLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    growthRate: {
      type: String,
      default: 'High Growth',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
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

export const Career = mongoose.model('Career', careerSchema);
