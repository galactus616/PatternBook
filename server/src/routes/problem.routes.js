import express from "express";
import { getProblems } from "../controllers/problem.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkSubscriptionExpiry } from "../middleware/subscription.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, checkSubscriptionExpiry, getProblems);

export default router;