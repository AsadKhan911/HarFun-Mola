import mongoose from "mongoose";
import { Bid } from "../../models/BiddingModule/bidModel.js";  // Make sure to import the Bid model

// Controller to fetch all jobs posted by a service user
export const getAllJobsPostedByUser = async (req, res) => {
  try {
    const { userId } = req.params; // Extract the userId from the request params

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch all bids posted by the user
    const userJobs = await Bid.find({ customerId: userId })
      .populate("customerId", "fullName email phoneNumber")  // Populate user details
      .sort({ createdAt: -1 });  // Optional: Sort jobs by creation date (latest first)

    // If no jobs are found
    if (!userJobs || userJobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for the user." });
    }

    // Return the jobs along with the service user details
    res.status(200).json({ message: "Jobs fetched successfully", jobs: userJobs });
  } catch (error) {
    console.error("Error fetching jobs posted by user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateJobById = async (req, res) => {
    try {
      const { jobId } = req.params;
      const { description, budget, images, status } = req.body;
  
      // Find the bid by ID
      const job = await Bid.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      // Update the job fields (only if provided)
      if (description) job.description = description;
      if (budget !== undefined) job.budget = budget;
      if (images) job.images = images;
      if (status) job.status = status;
  
      await job.save();
  
      res.status(200).json({ message: "Job updated successfully", updatedJob: job });
  
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };