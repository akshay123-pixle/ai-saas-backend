import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { getAllContent } from "../controllers/general.controller.js";
import { protect } from "../middleware/authentication.middleware.js";


const router = express.Router();
router.get("/getAllData", protect, getAllContent);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router