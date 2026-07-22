import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'Message must belong to a chat'],
    },
    content: {
      type: String,
      required: [true, 'Please provide message content'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'ai'],
      required: [true, 'Please specify the message role'],
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

// Index for faster queries by chat
messageSchema.index({ chat: 1, createdAt: 1 });

const messageModel= mongoose.model('Message', messageSchema);
export default messageModel;