import express from "express";
import {
    updateProgress,
    getProgress,
} from "../controllers/progress.controller.js";

const router = express.Router();

router.post("/", updateProgress);
router.get("/", getProgress);

export default router;