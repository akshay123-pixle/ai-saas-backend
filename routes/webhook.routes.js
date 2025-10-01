import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { User } from "../models/user.model.js";
import { Payment } from "../models/payment.model.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("✅ PaymentIntent succeeded:", paymentIntent);

        const metadata = paymentIntent.metadata || {};
        const userId = metadata.userId;
        const serviceType = metadata.serviceType || "Premium";
        const unit_amount = metadata.unit_amount ? parseInt(metadata.unit_amount, 10) : 0;

        if (!userId) {
          console.error("❌ No userId in metadata — cannot link payment");
          break;
        }

        try {
          // Save payment record
          const payment = await Payment.create({
            serviceType,
            amount: unit_amount,
            status: "Success",
            userId,
          });

          // Update user with payment reference
          await User.findByIdAndUpdate(userId, {
            serviceType,
            paymentId: payment._id,
          });

          console.log("✅ Payment & user updated in DB");
        } catch (err) {
          console.error("❌ DB error:", err);
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("❌ PaymentIntent failed:", paymentIntent);

        const metadata = paymentIntent.metadata || {};
        const userId = metadata.userId;
        const serviceType = metadata.serviceType || "Premium";
        const unit_amount = metadata.unit_amount ? parseInt(metadata.unit_amount, 10) : 0;

        if (!userId) break;

        try {
          await Payment.create({
            serviceType,
            amount: unit_amount,
            status: "Failed",
            userId,
          });
          console.log("🗃️ Failed payment saved");
        } catch (err) {
          console.error("❌ DB error on failed payment:", err);
        }

        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

export default router;
