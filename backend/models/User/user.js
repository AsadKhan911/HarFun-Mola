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

  verificationCode: { type: String }, // OTP for email verification

  verificationExpiry: { type: Date }, // Expiry date for OTP

  firebaseUID: { type: String },

  //   serviceName: { type: String },  Only for Service Providers

  // Only for Service Providers

  profile: {
    bio: { type: String },

    profilePic: {
      type: String,
      default: ""
    }
  },

  // feedbacks: [{ type: Schema.Types.ObjectId, ref: 'feedback' }], // Reference to feedbacks submitted

  //For service providers

  fullAddress: { type: String },

  certifications: [{
    type: String
  }],

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
  addressProofDocument: { type: String }, // URL to uploaded document

  policeDocument: { type: String }, // URL to uploaded document

  CNIC: {type: String},

  reviews: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, rating: Number, comment: String, createdAt: Date }],

  isAddressVerified: { type: Boolean, default: false },

  isPoliceCerVerified: { type: Boolean, default: false },

  backgroundCheckStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },

  addressVerificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },


  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },

}, { timestamps: true })

export const User = mongoose.model('user', userSchema)
