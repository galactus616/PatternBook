import express from "express";
import { getProblems } from "../controllers/problem.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProblems);

export default router;