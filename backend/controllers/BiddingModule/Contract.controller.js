import { BidOffer } from "../../models/BiddingModule/bidOffer.js";
import { Contract } from "../../models/BiddingModule/contract.js";
import { Bid } from "../../models/BiddingModule/bidModel.js";

export const acceptBidOffer = async (req, res) => {
  try {
    const { offerId, agreedPrice, contractTerms } = req.body; // offerId is the MongoDB ObjectId of the BidOffer

    // Validate the data
    if (!offerId || !agreedPrice || !contractTerms) {
      return res.status(400).json({ message: "Offer ID, agreed price, and contract terms are required." });
    }

    // Step 1: Find the BidOffer by its _id (offerId)
    const bidOffer = await BidOffer.findById(offerId).populate('bidId serviceProviderId');
    if (!bidOffer) {
      return res.status(404).json({ message: "Bid offer not found." });
    }

    // Step 2: Ensure the bid offer status is "Pending"
    if (bidOffer.status !== "Pending") {
      return res.status(400).json({ message: "Bid already accepted" });
    }

    // Step 3: Find the corresponding Bid
    const bid = await Bid.findById(bidOffer.bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found." });
    }

    // Step 4: Create the Contract
    const newContract = new Contract({
      bidId: bid._id,
      customerId: bid.customerId,
      serviceProviderId: bidOffer.serviceProviderId,
      agreedPrice,
      contractTerms,
    });

    // Save the contract
    await newContract.save();

    // Step 5: Update the BidOffer status to "Accepted"
    bidOffer.status = "Accepted";
    await bidOffer.save();

    // Step 6: Optionally update the Bid status to "Closed"
    bid.status = "Closed";
    await bid.save();

    res.status(200).json({ message: "Contract accepted and contract created successfully.", contract: newContract });
  } catch (error) {
    console.error("Error accepting bid offer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const rejectBidOffer = async (req, res) => {
  try {
    const { offerId } = req.body;

    if (!offerId) {
      return res.status(400).json({ message: "Offer ID is required." });
    }

    // Find the bid offer
    const bidOffer = await BidOffer.findById(offerId).populate('bidId serviceProviderId');
    if (!bidOffer) {
      return res.status(404).json({ message: "Bid offer not found." });
    }

    // Ensure the offer is still pending
    if (bidOffer.status !== "Pending") {
      return res.status(400).json({ message: "Only pending offers can be rejected." });
    }

    // Step 1: Update the bid offer status to Disagreed
    bidOffer.status = "Rejected";
    await bidOffer.save();

    // Optional: Create a contract with status Disagreed for record-keeping
    const bid = bidOffer.bidId;
    const newContract = new Contract({
      bidId: bid._id,
      customerId: bid.customerId,
      serviceProviderId: bidOffer.serviceProviderId,
      agreedPrice: bidOffer.proposedPrice,
      contractTerms: "User rejected the offer.",
      status: "Rejected",
    });

    await newContract.save();

    res.status(200).json({ message: "Bid offer rejected successfully.", contract: newContract });
  } catch (error) {
    console.error("Error rejecting bid offer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProviderOfferResponses = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    if (!serviceProviderId) {
      return res.status(400).json({ message: "Service provider ID is required." });
    }

    // Find all contracts related to the provider that are either accepted or rejected
    const contracts = await Contract.find({
      serviceProviderId,
      status: { $in: ["Agreed", "Rejected"] },
    })
      .populate("bidId")
      .populate("customerId", "fullName email")
      .populate("serviceProviderId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Offer responses fetched successfully.",
      contracts,
    });
  } catch (error) {
    console.error("Error fetching offer responses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
