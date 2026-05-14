import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkSubscriptionExpiry } from "../middleware/subscription.middleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, paymentController.createOrder);
router.post("/verify-payment", authMiddleware, paymentController.verifyPayment);
router.post("/validate-coupon", authMiddleware, paymentController.validateCouponPreview);
router.get("/history", authMiddleware, paymentController.getHistory);

export default router;
