import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    serviceType: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    budget: { type: Number, required: true },
    status: { type: String, enum: ["Open", "Interviewing" , "Closed", "Cancelled"], default: "Open" },
    createdAt: { type: Date, default: Date.now }
});

export const Bid = mongoose.model("Bid", BidSchema);
