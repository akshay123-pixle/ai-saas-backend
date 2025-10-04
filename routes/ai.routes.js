import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { blogTitle, writeArticle } from "../controllers/article.controller.js";
import { protect } from "../middleware/authentication.middleware.js";
import { blogtitleAI } from "../ai/blogTitleAI.js";
import { generateImage } from "../ai/generateImgAI.js";
import { backgroundRemoval } from "../ai/backgroundRemoval.js";
import { upload } from "../multer/fileHandling.multer.js";

const router = express.Router();

router.post("/write-article", writeArticle);
// blog

router.post("/blog-title", blogTitle);

router.post("/generate-image",generateImage)
router.post("/remove-background",upload.single("image"),backgroundRemoval)

export default router