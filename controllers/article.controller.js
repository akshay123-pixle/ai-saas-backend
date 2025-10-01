import mongoose from "mongoose";
import { articleAI } from "../ai/articleAI.js";
import { Generate } from "../models/aiGenerate.model.js";
import { blogtitleAI } from "../ai/blogTitleAI.js";

export const writeArticle = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const { text } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({
        message: "Please provide the prompt to proceed",
        success: false,
      });
    }

    // Generate article using AI
    const response = await articleAI(text);

    if (!response) {
      return res.status(500).json({
        success: false,
        message: "Could not generate article",
      });
    }

    // Save generation to DB
    const generate = await Generate.create({
      type: "write-article",
      input: text,
      output: response,
      userId: new mongoose.Types.ObjectId(userId), // convert string to ObjectId
    });

    return res.status(200).json({
      text: generate.output,
      success: true,
      message: "Successfully generated and saved to DB",
    });
  } catch (error) {
    console.error("Article Generation Error:", error);
    return res.status(500).json({
      message: "An error occurred while generating the article",
      success: false,
      error: error.message,
    });
  }
};

export const blogTitle = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { text } = req.body; // 🔍 CHANGE THIS LINE if you expect "prompt"

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!text || typeof text !== "string") {
      return res.status(400).json({ message: "Invalid input", success: false });
    }

    const response = await blogtitleAI(text);

    // if (response) {
    //   return res.status(400).json({ message: "AI failed", success: false });
    // }

    const generate = await Generate.create({
      type: "blog-title",
      input: text,
      output: response,
      userId: new mongoose.Types.ObjectId(userId),
    });

    return res.status(200).json({
      text: generate.output,
      success: true,
      message: "Successfully generated and saved to DB",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};

