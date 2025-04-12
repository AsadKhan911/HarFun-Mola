import mongoose from "mongoose";

// Define the SavedJob Schema
const savedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Assuming you have a "User" model to reference the user who saved the job
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bid", // Reference to the "Bid" or "Job" model (depending on your model)
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SavedJob = mongoose.model("SavedJob", savedJobSchema);

export default SavedJob;
