import mongoose from "mongoose";

const category = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String },
    predefinedServices: [{
        serviceName: { type: String, required: true },
        pricingOptions: [{
            label: { type: String, required: true },
        }]
    }]
}, { timestamps: true });

export const majorCategory = mongoose.model('category', category);

