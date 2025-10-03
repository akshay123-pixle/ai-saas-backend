import Stripe from "stripe";
import dotenv from "dotenv";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const vCreate = async (req, res) => {
  console.log("Inside vCreate, req.body:", req.body);
  const { unit_amount, serviceType = "Premium", userId } = req.body;
  const user = await User.find({ userId });
  // if (user.serviceType["Premium"]) {
  //   return res
  //     .status(400)
  //     .json({
  //       success: false,
  //       message: `$${user.name} has already paid so no need further`,
  //     });
  // }

  if (!unit_amount) {
    return res
      .status(400)
      .json({ success: false, message: "unit_amount is required" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${serviceType} subscription`,
            },
            unit_amount: unit_amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_API}/success`,
      cancel_url: `${process.env.FRONTEND_API}/cancel`,

      payment_intent_data: {
        metadata: {
          userId,
          unit_amount: unit_amount.toString(),
          serviceType,
        },
      },
    });

    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error in vCreate:", error);
    res.status(500).json({
      success: false,
      message: "Checkout session creation failed",
      error: error.message,
    });
  }
};
