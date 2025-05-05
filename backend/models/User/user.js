import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },

  email: {
    type: String,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
    required: true,
    lowercase: true,
    unique: true,
  },

  phoneNumber: { type: String, required: true },

  password: { type: String, required: true },

  role: { type: String, enum: ['Service User', 'Service Provider'], required: true },

  city: { type: String, enum: ['Rawalpindi', 'Lahore', 'Karachi'] },

  area: { type: String },

  // Add these new fields
  latitude: {
    type: Number,
    required: false // Can be optional if needed
  },
  longitude: {
    type: Number,
    required: false // Can be optional if needed
  },

  isEmailVerified: { type: Boolean, default: false },

  verificationCode: { type: String },

  verificationExpiry: { type: Date },

  firebaseUID: { type: String },

  stripeAccountId: { type: String },
  
  onboardingLink: { type: String },
  
  profile: {
    bio: { type: String },
    profilePic: { type: String, default: "" },
  },
  
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    rating: Number,
    comment: String,
    createdAt: Date
  }],


  pendingReviewBookings: [{
    pendingReview: { type: Boolean, default: false },
    bookingId: mongoose.Schema.Types.ObjectId,
    serviceProviderId: mongoose.Schema.Types.ObjectId,
    _id: false
  }],

  fullAddress: { type: String },

  certifications: [{ type: String }],

  availability: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  govtID: { type: String },

  experience: { type: Number, default: 0 },

  policeVerification: { type: Boolean, default: false },

  averageRating: { type: Number, default: 0 },

  addressProof: {
    type: String,
    enum: ['Utility Bill', 'Bank Statement', 'Driver’s License'],
    required: false
  },

  addressProofDocument: { type: String },

  policeDocument: { type: String },

  CNIC: { type: String },

  isAddressVerified: { type: Boolean, default: false },

  isPoliceCerVerified: { type: Boolean, default: false },

  backgroundCheckStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },

  addressVerificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },

  servicesOffered: [{ type: String }], // Empty array for users to add services dynamically

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
  
}, { timestamps: true });

export const User = mongoose.model('user', userSchema);
