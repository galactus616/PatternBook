import express from "express";
import {
    updateProgress,
    getProgress,
} from "../controllers/progress.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/", authMiddleware, getProgress);
router.post("/", authMiddleware, updateProgress);

export default router;