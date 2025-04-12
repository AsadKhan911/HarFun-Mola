// controllers/bidOfferController.js
import { BidOffer } from "../../models/BiddingModule/bidOffer.js";
import { Bid } from "../../models/BiddingModule/bidModel.js"; 

export const placeBidOffer = async (req, res) => {
  try {
    const { bidId, proposedPrice, additionalNotes } = req.body;
    const serviceProviderId = req.id;

    // Optional: Validate required fields manually
    if (!bidId  || !proposedPrice) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Optional: Check if the bid exists
    const bidExists = await Bid.findById(bidId);
    if (!bidExists) {
      return res.status(404).json({ message: "Bid/job not found." });
    }

    // Check if provider has already placed an offer on this bid (prevent duplicates)
    const existingOffer = await BidOffer.findOne({ bidId, serviceProviderId });
    if (existingOffer) {
      return res.status(400).json({ message: "You have already placed an offer on this job." });
    }

    const offer = new BidOffer({
      bidId,
      serviceProviderId,
      proposedPrice,
      additionalNotes,
    });

    await offer.save();

    res.status(201).json({ message: "Bid offer placed successfully.", offer });
  } catch (error) {
    console.error("Error placing bid offer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBidOffersByBidId = async (req, res) => {
  try {
      const { bidId } = req.params;

      if (!bidId) {
          return res.status(400).json({ message: "Bid ID is required." });
      }

      // Optional: Verify the bid exists
      const bidExists = await Bid.findById(bidId);
      if (!bidExists) {
          return res.status(404).json({ message: "Bid/job not found." });
      }

      // Fetch the bid offers and populate both bid details and service provider details
      const offers = await BidOffer.find({ bidId })
          .populate("bidId", "serviceType description images budget status")  // Populate bid details (serviceType, description, etc.)
          .populate("serviceProviderId", "fullName email phone profilePic") // Populate service provider details
          .sort({ createdAt: -1 });

      res.status(200).json({ message: "Offers fetched successfully", offers });
  } catch (error) {
      console.error("Error fetching bid offers:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Updated API to fetch all offers for all jobs posted by the service user
export const getAllBidOffersForUser = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed to get offers for a specific user

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch all bids posted by the user (assuming 'customerId' field in the Job/Bid schema)
    const userJobs = await Bid.find({ customerId: userId }); // Find all jobs posted by the service user
    console.log('Fetching bids for user:', userId);

    if (!userJobs || userJobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for the user." });
    }

    // Get all the offers related to these jobs with status "Pending"
    const offers = await BidOffer.find({
      bidId: { $in: userJobs.map((job) => job._id) }, // Match bids related to these jobs
      status: "Pending", // Filter only the offers with status "Pending"
    })
      .populate("bidId", "serviceType description images budget status")  // Populate bid details
      .populate("serviceProviderId", "fullName email phone profilePic") // Populate service provider details
      .sort({ createdAt: -1 }); // Sort offers by creation date

    res.status(200).json({ message: "Offers fetched successfully", offers });
  } catch (error) {
    console.error("Error fetching all bid offers for user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

