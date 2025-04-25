import mongoose from "mongoose";
import { Bid } from "../../models/BiddingModule/bidModel.js";  // Make sure to import the Bid model
import SavedJob from "../../models/BiddingModule/SavedJobs.js";
import { BidOffer } from "../../models/BiddingModule/bidOffer.js";
import { Contract } from "../../models/BiddingModule/contract.js";

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

  //Saved jobs
  // Controller to save a job when clicked on bookmark
export const saveJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Check if userId and jobId are provided
    if (!userId || !jobId) {
      return res.status(400).json({ message: "User ID and Job ID are required." });
    }

    // Check if the job exists
    const job = await Bid.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if the job is already saved by the user
    const existingSavedJob = await SavedJob.findOne({ userId, jobId });
    if (existingSavedJob) {
      return res.status(400).json({ message: "Job is already saved." });
    }

    // Create a new SavedJob entry
    const savedJob = new SavedJob({
      userId,
      jobId
    });

    // Save the saved job to the database
    await savedJob.save();

    // Return success response
    res.status(201).json({ message: "Job saved successfully", savedJob });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const completeJobById = async (req, res) => {
  try {
    const { jobId, contractId } = req.body;

    // 1. Update the Bid status to "Closed"
    const job = await Bid.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    job.status = "Closed";
    await job.save();

    // 2. Update the Contract status to "Completed"
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    contract.status = "Completed";
    await contract.save();

    res.status(200).json({
      message: "Job and contract successfully marked as completed.",
      updatedJob: job,
      updatedContract: contract,
    });
  } catch (error) {
    console.error("Error completing job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};