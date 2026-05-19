import express from "express";
import { getProfile } from "../controllers/profile.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:userId", optionalAuth, getProfile);

export default router;
