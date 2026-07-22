import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Chat must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a chat title'],
      trim: true,
      maxlength: [100, 'Chat title cannot exceed 100 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically updates createdAt and updatedAt
  }
);

// Index for faster queries by user
chatSchema.index({ user: 1, createdAt: -1 });

const chatModel= mongoose.model('Chat', chatSchema);

export default chatModel;
