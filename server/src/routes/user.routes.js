import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.patch("/me", authMiddleware, userController.updateProfile);
router.post("/me/export-data", authMiddleware, userController.exportData);
router.post("/me/reset-progress", authMiddleware, userController.resetProgress);
router.delete("/me", authMiddleware, userController.deleteAccount);

export default router;
