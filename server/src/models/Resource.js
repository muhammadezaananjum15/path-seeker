import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['PDF', 'DOCX', 'ZIP', 'Video', 'Link'],
      default: 'PDF',
    },
    fileSize: {
      type: String,
      default: '2.4 MB',
    },
    tags: {
      type: [String],
      default: [],
    },
    downloadCount: {
      type: Number,
      default: 0,
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

resourceSchema.index({ downloadCount: -1 });
resourceSchema.index({ createdAt: -1 });

export const Resource = mongoose.model('Resource', resourceSchema);
