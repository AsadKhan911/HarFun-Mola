// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  serviceListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MinorServiceListing",
    required: true
  },
  serviceUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  selectedIssue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PredefinedIssue",
    required: true
  },
  issueName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  diagnosticPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
    default: 'Pending'
  },
  specialInstructions: {
    type: String
  },
  cancellationReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index if needed for queries
bookingSchema.index({ coordinates: '2dsphere' });

export const MinorBooking = mongoose.model("MinorBooking", bookingSchema);