import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },

    feedbackText: { type: String, required: true },

    submittedAt: { type: Date, default: Date.now },

    responseStatus: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  });
  
  export const Feedback = mongoose.model('feedback', feedbackSchema);
  