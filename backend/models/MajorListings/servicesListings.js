import mongoose from "mongoose";

const services = new mongoose.Schema({
    serviceName: { 
        type: String, required: true 
    },
    description: { 
        type: String, required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'category' 
    }, 
    
    pricingOptions: [{
        label: { type: String, required: true }, // E.g., "250 sqft", "500 sqft"
        price: { type: Number, required: true }
    }],
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' // Reference from user schema
    },
    city: { 
        type: String, required: true 
    },
    location: { 
        type: String, required: true 
    },
    unavailableDates: [{ 
        type: Date 
    }], // Dates that are unavailable for work
    timeSlots: [{ 
        type: String, required: true 
    }], // Available time slots
    availability: { 
        type: Boolean, default: true 
    },
    Listingpicture: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const serviceListings = mongoose.model('majorListing', services)

//this schema is for the list posted by service provider on a specific category