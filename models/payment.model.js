import mongoose from "mongoose";

export const paymentSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String, 
      enum: ["Basic", "Premium"],
      default: "Basic",
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Success", "In_Progress", "Failed"],
      default: "Pending",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
