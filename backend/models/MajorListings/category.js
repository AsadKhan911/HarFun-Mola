import mongoose from "mongoose";

const category = new mongoose.Schema({
    name: { type: String, required: true },

    icon: { type: String },
    
}, { timestamps: true })

export const majorCategory = mongoose.model('category', category)

