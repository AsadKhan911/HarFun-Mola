import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "majorListing",
      required: true,
    },
    user: { //user who made the booking
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
    elapsedTime: { // New field to store total time taken
      type: String,
      default: null,
    },
    // Payment Fields
  paymentMethod: { 
    
    type: String, enum: ["COD", "CARD"], required: true 
  },
  paymentIntentId: { 
    
    type: String, default: null
   },
  paymentStatus: {
    type: String, enum: ["Pending", "Completed"], default: "Pending" 
  },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);