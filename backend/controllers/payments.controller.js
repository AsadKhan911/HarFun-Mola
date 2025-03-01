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

export const transferFunds = async (req, res) => {
  try {
      const { amount, serviceProviderStripeId } = req.body;

      const transfer = await stripe.transfers.create({
          amount, // Amount in cents (e.g., 1000 for £10)
          currency: "gbp",
          destination: serviceProviderStripeId, // Connected account ID
      });

      res.json({ success: true, transfer });
  } catch (error) {
      console.error("❌ Stripe Transfer Error:", error);
      res.status(500).json({ error: error.message });
  }
};

export const deleteConnectedAccount = async (req, res) => {
  try {
    const { stripeAccountId } = req.body;

    if (!stripeAccountId) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    // Delete the connected account
    await stripe.accounts.del(stripeAccountId);

    res.status(200).json({
      success: true,
      message: "Connected account deleted successfully",
    });

    console.log("Connected account deleted successfully");
  } catch (error) {
    console.error("Stripe Account Deletion Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const checkBalance = async (req, res) => {
  try {
      const balance = await stripe.balance.retrieve();
      res.json({
          available: balance.available,
          pending: balance.pending
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};