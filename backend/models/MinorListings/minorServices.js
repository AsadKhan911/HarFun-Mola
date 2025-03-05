const ServiceSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId, ref: "MinorCategory", required: true
  }, 

  service: {
    serviceName:{
      type: String, required: true
    },
    icon: { 
      type: String 
  }
  }, // e.g., "Microwave Repair"

  predefinedIssues: [{ // Static issue options
    issueName: {
      type: String, required: true
    }, // e.g., "Microwave Heater Issue"
    estimatedPrice: {
      min: Number, max: Number
    }, // Fixed estimated price range
    icon : {
      type: String 
    }
  }],

  diagnosticFee: {
    type: Number, required: true
  }, // Fixed diagnostic fee

  serviceProvider: [{
    type: mongoose.Schema.Types.ObjectId, ref: "user"
  }] // Providers offering this service
});


export const Service = mongoose.model("Service", ServiceSchema);