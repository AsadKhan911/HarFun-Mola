import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // Reference to the service being booked and also we will fetch the provider(user data) who post the listings from inside it.
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "majorListing", // References the serviceListings model.
    required: true
  },

  // Reference to the user making the booking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // References the User model
    required: true
  },

  date: {
    type: String,
    require: true
  },

  timeSlot: {
    type: String,
    required: true
  }, // Preferred time slot

  address: {
    type: String,
    required: true
  }, // Address for the service

  // Status of the booking (pending, confirmed, completed, etc.)
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "In-Progress", "Cancelled", "Completed"],
    default: "Pending"
  },

  // Optional additional instructions or notes
  instructions: {
    type: String,
    default: ""
  },
  orderNumber: {
    type: String,
    default: null, // This will be generated when status is "Confirmed"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Booking = mongoose.model("booking", bookingSchema);


// date: { type: Date, required: true },
// time: { type: String, required: true },

// These two values date and time we will dervived from createdAt (timestamps:true)