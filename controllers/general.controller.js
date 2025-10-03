import mongoose from "mongoose";
import { Generate } from "../models/aiGenerate.model.js";
import { User } from "../models/user.model.js";

export const getAllContent = async (req, res) => {
  try {
    const { userId } = req.body;
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

export const singleContent = async (req, res) => {
  const { contentId } = req.body;

  if (!contentId) {
    return res.status(400).json({
      success: false,
      message: "Content ID is required.",
    });
  }

  try {
    const content = await Generate.find({ _id: contentId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "No content found with the provided ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Content fetched successfully.",
      content,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the content.",
      error: error.message,
    });
  }
};


export const deleteContent = async (req, res) => {
  try {
    const { deleteId } = req.body;

    if (!deleteId) {
      return res.status(400).json({
        success: false,
        message: "Deletion ID is required.",
      });
    }

    const result = await Generate.deleteOne({ _id: deleteId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No content found with the provided ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the content.",
      error: error.message,
    });
  }
};

