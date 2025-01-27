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

  city: { type: String, enum: ['Rawalpindi' , 'Lahore' , 'Karachi'] },

  area : {type:String , required:true},

  isEmailVerified: { type: Boolean, default: false }, // Email verification status

  isDocVerified : {type: Boolean , default: false},

  verificationCode: { type: String }, // OTP for email verification

  verificationExpiry: { type: Date }, // Expiry date for OTP

  //   serviceName: { type: String },  Only for Service Providers

  serviceArea: { type: String }, // Only for Service Providers

  profile: {
    bio: { type: String },

    profilePic: {
      type: String,
      default: ""
    }
  },

  // feedbacks: [{ type: Schema.Types.ObjectId, ref: 'feedback' }], // Reference to feedbacks submitted

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },

}, { timestamps: true })

export const User = mongoose.model('user', userSchema)