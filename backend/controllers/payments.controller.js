import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config(); 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//For pending orders
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
      capture_method: "manual", //it prevents stripe from capturing the payment immediately
    });

    console.log(paymentIntent.id)
    res.status(200).json({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
};

//For completed orders
export const capturePayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "PaymentIntent ID is required" });
    }

    // Capture the payment
    const capturedPayment = await stripe.paymentIntents.capture(paymentIntentId);

    res.status(200).json({
      success: true,
      capturedPayment,
    });

    console.log("Payment complete successful")
  } catch (error) {
    console.error("Stripe Capture Error:", error);
    res.status(500).json({ error: error.message });
  }
};

//Cancel order - unatuhorizing payment
export const cancelPayment = async (req, res) => {
  try {
    console.log("Controller cancel starts")
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "PaymentIntent ID is required" });
    }

    // Cancel the authorized payment
    const canceledPayment = await stripe.paymentIntents.cancel(paymentIntentId);

    res.status(200).json({
      success: true,
      canceledPayment,
    });

    console.log("Payment authorization reversed successfully");
  } catch (error) {
    console.error("Stripe Cancel Error:", error);
    res.status(500).json({ error: error.message });
  }
};

//Transfer payout to service provider
export const transferToServiceProvider = async (req, res) => {
  try {
    const { amount, serviceProviderStripeId } = req.body;

    if (!amount || !serviceProviderStripeId) {
      return res.status(400).json({
        error: "Amount and service provider's Stripe ID are required",
      });
    }

    // Transfer the funds to the service provider
    const transfer = await stripe.transfers.create({
      amount: amount, // Amount to transfer (in cents)
      currency: "pkr", // Adjust the currency if needed
      destination: serviceProviderStripeId, // Service provider's Stripe account ID
    });

    res.status(200).json({
      success: true,
      message: "Payment transferred successfully",
      transfer,
    });

    console.log("Payment transferred successfully:", transfer);
  } catch (error) {
    console.error("Stripe Transfer Error:", error);
    res.status(500).json({ error: error.message });
  }
};
