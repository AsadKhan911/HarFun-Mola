import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config(); 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export const capturePayment = async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
  
      const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
  
      res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  