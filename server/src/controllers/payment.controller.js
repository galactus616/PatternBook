import * as paymentService from "../services/payment.service.js";
import * as couponService from "../services/coupon.service.js";

export const createOrder = async (req, res) => {
  try {
    const { planType, couponCode } = req.body;
    const userId = req.user.userId; // JWT payload key is 'userId'

    const { order, couponApplied } = await paymentService.createOrder(userId, planType, couponCode);
    res.json({ success: true, order, couponApplied });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await paymentService.verifyPayment(userId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const validateCouponPreview = async (req, res) => {
  try {
    const { couponCode, planType } = req.body;
    const userId = req.user.userId;

    if (!couponCode?.trim()) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const prices = { PRO: 49900, TEAM: 29900 };
    const originalAmount = prices[planType];
    if (!originalAmount) {
      return res.status(400).json({ success: false, message: "Invalid plan type" });
    }

    const { coupon, discountedAmount } = await couponService.validateCoupon(
      couponCode,
      userId,
      originalAmount
    );

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        originalAmount,
        discountedAmount,
        savings: originalAmount - discountedAmount,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
