import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    educationLevel: {
      type: String,
      default: 'High School',
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    workExperience: [
      {
        title: String,
        company: String,
        years: String,
        description: String,
      },
    ],
    resumeUrl: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    savedFilters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model('Profile', profileSchema);
