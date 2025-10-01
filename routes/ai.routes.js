import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { blogTitle, writeArticle } from "../controllers/article.controller.js";
import { protect } from "../middleware/authentication.middleware.js";
import { blogtitleAI } from "../ai/blogTitleAI.js";

const router = express.Router();

router.post("/write-article", protect, writeArticle);
// blog

router.post("/blog-title", protect, blogTitle);

export default router