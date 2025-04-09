import { BidOffer } from "../../models/BiddingModule/bidOffer";
import { Contract } from "../../models/BiddingModule/contract";
import { Bid } from "../../models/BiddingModule/bidModel";

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
      return res.status(400).json({ message: "Bid offer is not in 'Pending' state." });
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
