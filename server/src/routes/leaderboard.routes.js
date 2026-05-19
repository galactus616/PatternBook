import express from "express";
import * as leaderboardController from "../controllers/leaderboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, leaderboardController.getLeaderboard);

export default router;
