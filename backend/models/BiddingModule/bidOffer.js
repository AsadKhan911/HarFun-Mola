import mongoose from "mongoose";

const BidOfferSchema = new mongoose.Schema({
    bidId: { type: mongoose.Schema.Types.ObjectId, ref: "Bid", required: true },
    serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    proposedPrice: { type: Number, required: true },
    additionalNotes: { type: String },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

export const BidOffer = mongoose.model("BidOffer", BidOfferSchema);
