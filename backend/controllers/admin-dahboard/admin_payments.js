import stripe from "stripe";
import { Booking } from "../../models/MajorListings/booking.js";

// Get All Payments with pagination and filters
export const getAllPayments = async (req, res) => {
  try {
    const { status, method, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.paymentStatus = status;
    if (method) query.paymentMethod = method;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: "user", select: "fullName email" },
        { path: "service", select: "serviceName" }
      ]
    };

    const payments = await Booking.paginate(query, options);

    res.json({
      success: true,
      payments: payments.docs,
      totalCount: payments.total,
      totalPages: payments.totalPages,
      currentPage: payments.page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Payment Details
export const getPaymentDetails = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const booking = await Booking.findOne({ orderNumber })
      .populate("user", "fullName email")
      .populate("service", "serviceName");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Payment as Completed
export const markPaymentAsCompleted = async (req, res) => {
  try {
    const { orderNumber } = req.body;

    const booking = await Booking.findOne({ orderNumber });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.paymentStatus === "Completed") {
      return res.status(400).json({ error: "Payment already completed" });
    }

    booking.paymentStatus = "Completed";
    await booking.save();

    res.json({ success: true, message: "Payment marked as completed." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List Stripe Transfers
export const listTransfers = async (req, res) => {
  try {
    const transfers = await stripe.transfers.list({
      limit: 100,
      created: req.query.created ? { gt: req.query.created } : undefined
    });
    res.json({ success: true, transfers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process Refund
export const refundPayment = async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    const refundParams = {
      payment_intent: paymentIntentId
    };

    if (amount) {
      refundParams.amount = Math.round(amount * 100); // Convert to cents
    }

    if (reason) {
      refundParams.reason = reason;
    }

    const refund = await stripe.refunds.create(refundParams);

    // Update booking status if refund is successful
    if (refund.status === "succeeded") {
      await Booking.findOneAndUpdate(
        { paymentIntentId },
        { paymentStatus: "Cancelled" }
      );
    }

    res.json({ success: true, refund });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};