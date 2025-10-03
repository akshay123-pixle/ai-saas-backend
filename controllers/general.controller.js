import mongoose from "mongoose";
import { Generate } from "../models/aiGenerate.model.js";
import { User } from "../models/user.model.js";

export const getAllContent = async (req, res) => {
  try {
    const {userId} = req.body
    // console.log("userId",userId);
    
    
    if (!userId) {
      return res.status(400).json({
        message: "Please login",
        success: false,
      });
    }

    const allContent = await Generate.find({ userId: userId });
    if (allContent.length < 0) {
      return res.status(400).json({
        message: "No Content found in DB!!!!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Successfully fetched the content",
      allContent: allContent,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      message: "Failed to fetch the messages",
      error,
      success: false,
    });
  }
};
