import mongoose from "mongoose";

const otpSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    otpCode: { type: String, required: true },
    otpType: { type: String, enum: ['emailVerification', 'passwordRecovery'], required: true },
    expiry: { type: Date, required: true },
  });

export const Otp = mongoose.model('otp' , otpSchema)