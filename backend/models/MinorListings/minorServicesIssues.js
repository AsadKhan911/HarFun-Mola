import mongoose from "mongoose";

const MinorPredefinedIssue = new mongoose.Schema({
  service: { 
    type: mongoose.Schema.Types.ObjectId, ref: "MinorService", required: true 
  }, // Reference to Service Model

  issueName: { type: String, required: true }, 

  icon: { type: String },

  description: { type: String }
});

export const MinorPredefinedIssues = mongoose.model("PredefinedIssue", MinorPredefinedIssue);
