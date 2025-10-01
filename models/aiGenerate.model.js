import mongoose from "mongoose";

export const aiGeneratedSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "write-article",
        "blog-title",
        "generate-images",
        "remove-bg",
        "remove-object",
        "review-resume"
      ],
      required: true,
    },

    input: {
      type: mongoose.Schema.Types.Mixed, // Allows text, image URL, base64, etc.
      required: true,
    },

    output: {
      type: mongoose.Schema.Types.Mixed, // Text, image URL, structured JSON, etc.,
      required:true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed, // Optional: store config, model, duration, etc.
      default: {},
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Generate = mongoose.model("Generate", aiGeneratedSchema);
