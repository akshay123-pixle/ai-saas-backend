// removeBackgroundFromURL.js

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Removes background from a remote image URL
 * @param {string} imageUrl - Publicly accessible image URL
 */
async function removeBackgroundFromURL(imageUrl) {
  try {
    // Step 1: Upload image from URL to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: "bg-removed",
    });

    console.log("✅ Uploaded remote image:", uploadResult.secure_url);

    // Step 2: Apply background removal transformation
    const bgRemovedUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [{ effect: "bgremoval" }],
      format: "png", // Preserve transparency
    });

    console.log("✅ Background-removed image URL:");
    console.log(bgRemovedUrl);

    return bgRemovedUrl;
  } catch (err) {
    console.error("❌ Error removing background:", err.message);
  }
}

// Example usage
const remoteImageUrl = "https://images.unsplash.com/photo-1758671451540-58f5ef5a49ea?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Any public image URL
await removeBackgroundFromURL(remoteImageUrl);
