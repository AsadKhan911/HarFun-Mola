import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema({
    bidId: { type: mongoose.Schema.Types.ObjectId, ref: "Bid", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    agreedPrice: { type: Number, required: true },
    contractTerms: { type: String, required: true },
    status: { type: String, enum: [ "Agreed", "Interviewing" , "Rejected" , "Completed"], default: "Interviewing" },
    createdAt: { type: Date, default: Date.now }
});

export const Contract = mongoose.model("Contract", ContractSchema);
