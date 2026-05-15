import express from "express";
import { getProfile } from "../controllers/profile.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public but detects user if logged in
router.get("/:userId", optionalAuth, getProfile);

export default router;
