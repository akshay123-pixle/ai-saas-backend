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

// Note: **do not** use `protect` middleware here, since Stripe sends webhook calls
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

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("✅ Payment successful, session:", session);

        // Extract metadata
        const { serviceType, unit_amount: amtStr } = session.metadata || {};
        const unit_amount = amtStr ? parseInt(amtStr, 10) : undefined;

        // The session might have a client_reference_id or metadata including a user ID
        const customerId = session.customer; // stripe customer id
        const client_reference_id = session.client_reference_id;
        // Or, if you passed userId in metadata:
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error("No userId in metadata — cannot link payment");
        } else {
          try {
            // Create a payment record
            const payment = await Payment.create({
              serviceType: serviceType || "Premium",
              amount: unit_amount || 0,
              status: "Success",
              userId: userId,
            });

            // Update user
            await User.findByIdAndUpdate(userId, {
              serviceType: serviceType || "Premium",
              paymentId: payment._id,
            });
            console.log("✅ Payment & user updated in database");
          } catch (dbErr) {
            console.error("Database error in webhook handler:", dbErr);
          }
        }

        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
      case "checkout.session.async_payment_canceled": {
        const session = event.data.object;
        console.log("❌ Payment failed / expired, session:", session);

        // Similar logic if you want to record failed payments
        const { serviceType, unit_amount: amtStr } = session.metadata || {};
        const unit_amount = amtStr ? parseInt(amtStr, 10) : undefined;
        const userId = session.metadata?.userId;

        if (userId) {
          try {
            await Payment.create({
              serviceType: serviceType || "Premium",
              amount: unit_amount || 0,
              status: "Failed",
              userId: userId,
            });
          } catch (dbErr) {
            console.error("DB error saving failed payment:", dbErr);
          }
        }

        break;
      }
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    // Return a response to Stripe
    res.json({ received: true });
  }
);

export default router;
