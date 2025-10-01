import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.DYNAPICTURES_API_KEY;
const DESIGN_UID = process.env.DYNAPICTURES_DESIGN_UID;

const payload = {
  params: [
    {
      name: "text1",
      text: "cat is having meal",
      color: "#333",
      backgroundColor: "#f9f9f9",
      borderColor: "#ddd",
      borderWidth: "1px",
      borderRadius: "5px",
      opacity: 1,
      width: "100px",
      height: "100px"
    },
  ],
};

async function generateImage() {
  const url = `https://api.dynapictures.com/workspaces}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("✅ API Response:", data);

    if (!res.ok) {
      console.error("❌ API Error:", data);
      return;
    }

    const imageUrl = data.imageUrl; // ✅ Corrected
    const imageRes = await fetch(imageUrl);
    const buffer = await imageRes.buffer();
    fs.writeFileSync("dynapictures-image.jpeg", buffer); // Changed extension to match response
    console.log("✅ Image saved as dynapictures-image.jpeg");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

await generateImage();
