import express from "express";
import * as friendController from "../controllers/friend.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, friendController.getFriends);
router.get("/pending", authMiddleware, friendController.getPending);
router.get("/search", authMiddleware, friendController.searchUsers);
router.post("/request", authMiddleware, friendController.sendRequest);
router.post("/accept", authMiddleware, friendController.acceptRequest);
router.delete("/:requestId", authMiddleware, friendController.removeFriendship);

export default router;
