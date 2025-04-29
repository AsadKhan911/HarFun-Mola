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
        label: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    city: { 
        type: String, required: true 
    },
    location: { 
        type: String, required: true 
    },
    // Add these new fields for coordinates
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    unavailableDates: [{ 
        type: Date 
    }],
    timeSlots: [{ 
        type: String, required: true 
    }],
    availability: { 
        type: Boolean, default: true 
    },
    Listingpicture: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const serviceListings = mongoose.model('majorListing', services)