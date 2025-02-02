import mongoose from "mongoose";

const services = new mongoose.Schema({
    serviceName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' }, // Reference to Category,
    price: { type: Number, required: true },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' //refrence from user schema
    },
    city : {type: String , required: true},
    location : {type: String , required: true},
    availability: { type: Boolean, default: true },
    Listingpicture: {
        type: String,
        default: ""
      }
}, { timestamps: true })

export const serviceListings = mongoose.model('majorListing', services)

//this schema is for the list posted by service provider on a specific category