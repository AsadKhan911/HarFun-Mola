import mongoose from "mongoose";

const MinorServiceListingSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MinorService",
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MinorCategory'
    },
    city: {
        type: String, 
        required: true
    },
    location: {
        type: String, 
        required: true
    },
    coordinates: { // New field for geolocation
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    diagnosticPrice: {
        type: Number, 
        required: true
    },
    predefinedIssues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PredefinedIssue",
            required: true
        }
    ],
    issuePricing: [{
        issueName: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    timeSlots: { // New field for time slots
        type: [String],
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user", 
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    availability: {
        type: Boolean, 
        default: true
    },
    Listingpicture: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create geospatial index for location-based queries
MinorServiceListingSchema.index({ coordinates: '2dsphere' });

export const MinorServiceListing = mongoose.model("MinorServiceListing", MinorServiceListingSchema);