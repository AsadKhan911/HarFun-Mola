import mongoose from "mongoose";

const minorCategories = new mongoose.Schema({
    name: { 
        type: String, required: true 
    },  // e.g., "Electricity", "Plumbing"
    
    icon: { 
        type: String 
    }
}, { timestamps: true });

export const MinorCategory = mongoose.model('MinorCategory', minorCategories);
