import fetch from "node-fetch";
import FormData from "form-data";
import dotenv from "dotenv";
import cloudinary from "../utils/cloudinary.js";
import { Generate } from "../models/aiGenerate.model.js";

dotenv.config();

const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;

export async function generateImage(req, res) {
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and userId are required" });
  }

  try {
    // Step 1: Prepare form data for ClipDrop
    const form = new FormData();
    form.append("prompt", prompt);

    // Step 2: Call ClipDrop API
    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": CLIPDROP_API_KEY,
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ClipDrop API error: ${response.status} ${errorText}`);
    }

    // Step 3: Read image data as buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optional: Save image locally (for debugging)
    // await fs.writeFile("cat.png", buffer);

    // Step 4: Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Step 5: Save to MongoDB
    const savedImage = await Generate.create({
      userId,
      type: "remove-bg",
      input: prompt,
      output: uploadResult.secure_url,
    });

    // Step 6: Return success response
    return res.status(200).json({
      success: true,
      message: "background removed successfully, uploaded, and saved",
      imageUrl: savedImage.output,
    });
  } catch (error) {
    console.error("Generate image error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate image",
      error: error.message,
    });
  }
}
