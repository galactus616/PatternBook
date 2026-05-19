import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as notificationController from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", notificationController.getNotifications);
router.put("/read-all", notificationController.markAllAsRead);
router.put("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

export default router;
