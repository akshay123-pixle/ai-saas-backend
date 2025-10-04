import fetch from "node-fetch";
import FormData from "form-data";
import dotenv from "dotenv";
import cloudinary from "../utils/cloudinary.js";
import { Generate } from "../models/aiGenerate.model.js";

dotenv.config();

const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY;

export async function backgroundRemoval(req, res) {
  const { userId  } = req.body;

  if (!req.file || !userId) {
    return res.status(400).json({ error: "Image file and userId are required" });
  }

  try {
    // Step 1: Prepare form data for ClipDrop
    const form = new FormData();
    form.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Step 2: Call ClipDrop API
    const response = await fetch("https://clipdrop-api.co/remove-background/v1", {
      method: "POST",
      headers: {
        "x-api-key": CLIPDROP_API_KEY,
        ...form.getHeaders(), // important for multipart
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ClipDrop API error: ${response.status} - ${errorText}`);
    }

    // Step 3: Get image buffer from ClipDrop
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 4: Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Step 5: Save to MongoDB
    const saved = await Generate.create({
      userId,
      type: "remove-bg",
      input: req.file.originalname,
      output: uploadResult.secure_url,
    });

    // Step 6: Send response
    res.status(200).json({
      success: true,
      message: "Background removed, image uploaded and saved",
      imageUrl: saved.output,
    });

  } catch (error) {
    console.error("Background removal error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove background and upload image",
      error: error.message,
    });
  }
}
