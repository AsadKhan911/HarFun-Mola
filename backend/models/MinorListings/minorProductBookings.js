const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "user", required: true
    },

    serviceListing: {
        type: mongoose.Schema.Types.ObjectId, ref: "MinorServiceListing", required: true
    }, // Links to provider-specific pricing

    date: {
        type: String,
        required: true,
    },

    timeSlot: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    latitude: {
        type: Number,
        required: true,
    },

    longitude: {
        type: Number,
        required: true,
    },
    selectedIssue: {
        type: String // Stores the selected repair issue or "Diagnostic Service"
    },

    price: {
        type: Number, required: true
    }, // Stores either repair cost or diagnostic fee

    status: {
        type: String,
        enum: ["Pending", "In Diagnostic", "Awaiting Confirmation", "Repair in Progress", "Completed", "Cancelled"],
        default: "Pending"
    },

    instructions: {
        type: String,
        default: "",
    },

    orderNumber: {
        type: String,
        default: null,
    },

    elapsedTime: {
        type: String,
        default: null,
    },
    // Payment Fields
    paymentMethod: {
        type: String,
        enum: ["COD", "CARD"],
        required: true,
    },

    paymentIntentId: {
        type: String,
        default: null,
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        default: "Pending",
    },

    startTime: {
        type: Date,
        default: null,
    },

    completedTime: {
        type: Date,
        default: null,
    },

    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },

    diagnosticReport: {
        issueIdentified: String,
        suggestedPrice: Number,
        status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
        updatedAt: { type: Date, default: null } // Tracking updates
    },

    refundStatus: {
        type: String,
        enum: ["Not Applicable", "Initiated", "Completed"],
        default: "Not Applicable"
    },

    createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.model("Booking", BookingSchema);
