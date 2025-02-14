import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({

  fullName: { type: String, required: true },

  // username: { type: String, required: true, unique: true },

  email: {
    type: String,

    validate(value) {
      if (!validator.isEmail(value)) { //This will check if the entered email is not valid then throw error.
        throw new Error("Email is inValid")
      }
    },
    required: true,
    lowercase: true,
    unique: true
  },

  phoneNumber: { type: String, required: true },

  password: { type: String, required: true },

  role: { type: String, enum: ['Service User', 'Service Provider'], required: true },

  city: { type: String, enum: ['Rawalpindi', 'Lahore', 'Karachi'] },

  area: { type: String, required: true },

  isEmailVerified: { type: Boolean, default: false }, // Email verification status

  isDocVerified: { type: Boolean, default: false },

  verificationCode: { type: String }, // OTP for email verification

  verificationExpiry: { type: Date }, // Expiry date for OTP

  firebaseUID: { type: String },

  //   serviceName: { type: String },  Only for Service Providers

  serviceArea: { type: String }, // Only for Service Providers

  profile: {
    bio: { type: String },

    profilePic: {
      type: String,
      default: ""
    }
  },
  experience: {
    type: Number, default: 0
  },
  certifications: [{
    type: String
  }],

  availability: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },

  govtID: { type: String },

  backgroundCheckStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },

  policeVerification: { type: Boolean, default: false },

  averageRating: { type: Number, default: 0 },

  addressProof: {
    type: String,
    enum: ['Utility Bill', 'Bank Statement', 'Lease Agreement', 'Driver’s License'],
    required: false
  },
  addressProofDocument: { type: String }, // URL to uploaded document
  addressVerificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },

  reviews: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, rating: Number, comment: String, createdAt: Date }],

  // feedbacks: [{ type: Schema.Types.ObjectId, ref: 'feedback' }], // Reference to feedbacks submitted

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },

}, { timestamps: true })

export const User = mongoose.model('user', userSchema)

