import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId, ref: "MinorCategory", required: true
  }, 

  serviceName: { type: String, required: true },

  serviceIcon: { type: String },

  description: {type:String},

  priceRange: {
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true }
  },

  predefinedIssues: [{ // Static issue options
   type: mongoose.Schema.Types.ObjectId, ref: "PredefinedIssue"
  }],

});


export const Service = mongoose.model("MinorService", ServiceSchema);