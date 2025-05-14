import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const bookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "majorListing",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In-Progress", "Cancelled", "Completed"],
      default: "Pending",
    },
    instructions: {
      type: String,
      default: "",
    },
    orderNumber: {
      type: String,
      unique: true,
      index: true,
      default: null,
    },
    startTime: {
      type: Date,
      default: null,
    },
    completedTime: {
      type: Date,
      default: null,
    },
    elapsedTime: {
      type: String,
      default: null,
    },
    // Payment Fields
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      required: true,
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled" , "Refunded"],
      default: "Pending",
    },
    // New field: Selected Pricing Option
    selectedPricingOption: {
      label: { type: String, required: true }, // E.g., "250 sqft", "500 sqft"
      price: { type: Number, required: true }, // Price for the selected option
    },
  },
  { timestamps: true }
);

bookingSchema.plugin(mongoosePaginate);
export const Booking = mongoose.model("Booking", bookingSchema);