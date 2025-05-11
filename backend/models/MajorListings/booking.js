// import mongoose from "mongoose";
// import mongoosePaginate from 'mongoose-paginate-v2'

// const bookingSchema = new mongoose.Schema(
//   {
//     service: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "majorListing",
//       required: true,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },
//     date: {
//       type: String,
//       required: true,
//     },
//     timeSlot: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     latitude: {
//       type: Number,
//       required: true,
//     },
//     longitude: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Confirmed", "In-Progress", "Cancelled", "Completed"],
//       default: "Pending",
//     },
//     instructions: {
//       type: String,
//       default: "",
//     },
//     orderNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//       default: null,
//     },
//     startTime: {
//       type: Date,
//       default: null,
//     },
//     completedTime: {
//       type: Date,
//       default: null,
//     },
//     elapsedTime: {
//       type: String,
//       default: null,
//     },
//     // Payment Fields
//     paymentMethod: {
//       type: String,
//       enum: ["COD", "CARD"],
//       required: true,
//     },
//     paymentIntentId: {
//       type: String,
//       default: null,
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Completed", "Cancelled" , "Refunded"],
//       default: "Pending",
//     },
//     // New field: Selected Pricing Option
//     selectedPricingOption: {
//       label: { type: String, required: true }, // E.g., "250 sqft", "500 sqft"
//       price: { type: Number, required: true }, // Price for the selected option
//     },
//   },
//   { timestamps: true }
// );

// bookingSchema.plugin(mongoosePaginate);
// export const Booking = mongoose.model("Booking", bookingSchema);

import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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
      required: true,
      unique: true,
      index: true,
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
    // Enhanced Payment Fields for PKR
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "JazzCash", "EasyPaisa", "BankTransfer"],
      required: true,
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Refunded", "Partially_Refunded"],
      default: "Pending",
    },
    currency: {
      type: String,
      default: "PKR",
      immutable: true, // Ensures currency can't be changed after creation
    },
    selectedPricingOption: {
      label: { type: String, required: true },
      price: { type: Number, required: true }, // Always in PKR
      currency: {
        type: String,
        default: "PKR",
      },
    },
    // Enhanced Refund Tracking
    refundDetails: {
      refundId: String, // Stripe refund ID or bank reference
      amount: Number, // In PKR
      reason: {
        type: String,
        enum: [
          "service_unsatisfactory",
          "service_not_provided",
          "customer_request",
          "duplicate_charge",
          "other"
        ],
      },
      notes: String,
      processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      processedAt: Date,
      method: {
        type: String,
        enum: ["Stripe", "JazzCash", "EasyPaisa", "BankTransfer", "Cash"],
      },
      status: {
        type: String,
        enum: ["pending", "processed", "failed"],
        default: "pending",
      },
    },
    // Local Payment Method Details
    localPaymentDetails: {
      jazzCashReference: String,
      easyPaisaTransactionId: String,
      bankTransactionId: String,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, // For currency formatting in API responses
    toObject: { virtuals: true },
  }
);

// Virtual for formatted price display
bookingSchema.virtual('formattedPrice').get(function() {
  return `${this.selectedPricingOption.price.toLocaleString('en-PK')} PKR`;
});

// Indexes for faster queries
bookingSchema.index({ orderNumber: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ 'refundDetails.status': 1 });

// Pagination plugin
bookingSchema.plugin(mongoosePaginate);

// Pre-save hook for currency validation
bookingSchema.pre('save', function(next) {
  if (this.selectedPricingOption && !this.selectedPricingOption.currency) {
    this.selectedPricingOption.currency = 'PKR';
  }
  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);