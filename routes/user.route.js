import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { deleteContent, getAllContent, singleContent } from "../controllers/general.controller.js";
import { protect } from "../middleware/authentication.middleware.js";


const router = express.Router();
router.post("/getAllData", getAllContent);
router.post("/getSingle", singleContent);
router.post("/delete", deleteContent);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router