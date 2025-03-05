import mongoose from "mongoose";

const ServiceListingSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true
    }, // Links to predefined services like "Microwave Repair"

    description: {
        type: String, required: true
    },

    created_by: {
        type: mongoose.Schema.Types.ObjectId, ref: "user", required: true
    }, // Provider offering this service

    issuePricing: [{
        issueName: { type: String, required: true },
        price: { type: Number, required: true } // Provider-defined price
    }],

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
    },

    diagnosticFee: {
        type: Number, required: true
    } // Provider-defined diagnostic fee
}, { timestamps: true });

export const ServiceListing = mongoose.model("MinorServiceListing", ServiceListingSchema);
