import { razorpay } from "../config/razorpay.js";
import { prisma } from "../db/client.js";
import crypto from "crypto";
import * as couponService from "./coupon.service.js";

/**
 * Create a new Razorpay Order
 */
export const createOrder = async (userId, planType, couponCode) => {
  // Define prices (In Paise: ₹499 = 49900)
  const prices = {
    PRO: 49900,
    TEAM: 29900, // Per seat, simplified for now
  };

  const originalAmount = prices[planType];
  if (!originalAmount) throw new Error("Invalid plan type");

  // Validate Coupon
  const { coupon, discountedAmount } = await couponService.validateCoupon(
    couponCode,
    userId,
    originalAmount
  );

  const options = {
    amount: discountedAmount,
    currency: "INR",
    receipt: `receipt_user_${userId.substring(0, 10)}_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  // Store the transaction as 'created'
  await prisma.transaction.create({
    data: {
      userId,
      razorpayOrderId: order.id,
      amount: discountedAmount,
      status: "created",
      currency: "INR",
      couponId: coupon?.id,
    },
  });

  return { order, couponApplied: !!coupon };
};

/**
 * Verify Razorpay Signature and Update User Plan
 */
export const verifyPayment = async (userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  // 1. Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    throw new Error("Payment verification failed: Invalid signature");
  }

  // 2. Update transaction record
  const transaction = await prisma.transaction.update({
    where: { razorpayOrderId: razorpay_order_id },
    data: {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "captured",
    },
  });

  // 2b. If coupon was used, record usage
  if (transaction.couponId) {
    await couponService.recordUsage(transaction.couponId, userId);
  }

  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: "PRO",
      subscriptionStatus: "ACTIVE",
      subscriptionEndsAt: expiryDate,
      subscriptionId: razorpay_order_id,
    },
  });

  return { success: true, transaction };
};

/**
 * Get Payment History for a user
 */
export const getPaymentHistory = async (userId) => {
  return await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
