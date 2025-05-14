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
    bidOffer.status = "Interviewing";
    await bidOffer.save();

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

    // Fetch only 'Interviewing' and 'Rejected' contracts
    const contracts = await Contract.find({
      serviceProviderId,
      status: { $in: ["Interviewing", "Rejected"] },
    })
      .populate("bidId")
      .populate("customerId", "fullName email profile")
      .populate("serviceProviderId", "fullName email profile")
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

export const getAgreedContractsForProvider = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    if (!serviceProviderId) {
      return res.status(400).json({ message: "Service provider ID is required." });
    }

    // Fetch only contracts with status "Agreed"
    const contracts = await Contract.find({
      serviceProviderId,
      status: "Agreed",
    })
      .populate("bidId")
      .populate("customerId", "fullName email")
      .populate("serviceProviderId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Agreed contracts fetched successfully.",
      contracts,
    });
  } catch (error) {
    console.error("Error fetching agreed contracts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCompletedContractsForProvider = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    if (!serviceProviderId) {
      return res.status(400).json({ message: "Service provider ID is required." });
    }

    // Fetch only contracts with status "Agreed"
    const contracts = await Contract.find({
      serviceProviderId,
      status: "Completed",
    })
      .populate("bidId")
      .populate("customerId", "fullName email")
      .populate("serviceProviderId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Agreed contracts fetched successfully.",
      contracts,
    });
  } catch (error) {
    console.error("Error fetching agreed contracts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getInterviewingOffers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const offers = await BidOffer.find({ status: "Interviewing" })
      .populate({
        path: "bidId",
        match: { customerId: userId },
        select: "serviceType description status budget", // Select only relevant fields
      })
      .populate({
        path: "serviceProviderId",
        select: "fullName email phoneNumber profile", // Optional: reduce payload
      });

    // Filter out offers without matched bidId
    const filteredOffers = offers.filter((offer) => offer.bidId !== null);

    res.status(200).json({ offers: filteredOffers });
  } catch (error) {
    console.error("Error fetching interviewing offers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const hireBidOffer = async (req, res) => {
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

    // Step 2: Ensure the bid offer status is "Interviewing"
    if (bidOffer.status !== "Interviewing") {
      return res.status(400).json({ message: "Bid offer is not in 'Interviewing' status." });
    }

    // Step 3: Find the corresponding Bid
    const bid = await Bid.findById(bidOffer.bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found." });
    }

    // Step 4: Find the existing contract
    const existingContract = await Contract.findOne({ bidId: bid._id, serviceProviderId: bidOffer.serviceProviderId });
    if (!existingContract) {
      return res.status(404).json({ message: "Contract not found." });
    }

    // Step 5: Update the existing contract with agreed price and contract terms
    existingContract.agreedPrice = agreedPrice;
    existingContract.contractTerms = contractTerms;

    // Save the updated contract
    await existingContract.save();

    // Step 6: Update the BidOffer status to "Accepted"
    bidOffer.status = "Accepted"; // Marking the bid offer as accepted
    await bidOffer.save();

    // Step 7: Update the Bid status to "Closed"
    bid.status = "Closed"; // Marking the bid as closed
    await bid.save();

    res.status(200).json({ message: "Provider hired successfully, contract updated, and bid closed.", contract: existingContract });
  } catch (error) {
    console.error("Error hiring bid offer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateContractStatus = async (req, res) => {
  try {
    const { bidId } = req.params;  // Expecting the bidId as a URL parameter
    const { status } = req.body;

    // Validate status value
    const validStatuses = ["Agreed", "Interviewing", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    // Find the contract based on the bidId and update the status
    const contract = await Contract.findOneAndUpdate(
      { bidId },  // Find contract by bidId
      { status },
      { new: true }  // Return the updated contract
    ).populate("customerId serviceProviderId bidId");  // Populate the related fields

    if (!contract) {
      return res.status(404).json({ message: "Contract not found." });
    }

    res.status(200).json({ message: "Contract status updated.", contract });
  } catch (error) {
    console.error("Error updating contract status:", error);
    res.status(500).json({ message: "Server error. Could not update contract status." });
  }
};