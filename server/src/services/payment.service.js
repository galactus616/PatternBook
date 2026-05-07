import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "../db/client.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan Pricing in Paise (₹499 = 49900)
const PLAN_PRICES = {
  PRO: 49900,
  TEAM: 29900, // Per seat
};

/**
 * Creates a Razorpay Order
 */
export const createOrder = async (userId, plan, couponCode = null) => {
  let amount = PLAN_PRICES[plan];
  if (!amount) throw new Error("Invalid plan selected");

  // 1. Handle Coupon Logic
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode, isActive: true },
    });

    if (coupon) {
      const now = new Date();
      const isExpired = coupon.expiresAt && coupon.expiresAt < now;
      const isExhausted = coupon.maxUses && coupon.usedCount >= coupon.maxUses;

      if (!isExpired && !isExhausted) {
        if (coupon.discountType === "PERCENTAGE") {
          amount = Math.round(amount * (1 - coupon.discountValue / 100));
        } else if (coupon.discountType === "FLAT") {
          amount = Math.max(0, amount - coupon.discountValue);
        }
      }
    }
  }

  // 2. If amount is 0, we don't need Razorpay
  if (amount === 0) {
    const order = await prisma.order.create({
      data: {
        userId,
        amount: 0,
        plan,
        status: "COMPLETED",
        razorpayOrderId: `FREE_${crypto.randomBytes(8).toString("hex")}`,
        couponCode,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });

    return { success: true, isFree: true, order };
  }

  // 3. Create Razorpay Order
  const options = {
    amount: amount,
    currency: "INR",
    receipt: `receipt_${userId}_${Date.now()}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  // 4. Save Pending Order to DB
  await prisma.order.create({
    data: {
      userId,
      amount: amount,
      plan,
      razorpayOrderId: razorpayOrder.id,
      status: "PENDING",
      couponCode,
    },
  });

  return {
    success: true,
    isFree: false,
    key: process.env.RAZORPAY_KEY_ID,
    order: razorpayOrder,
  };
};

/**
 * Verifies Razorpay Signature
 */
export const verifyPayment = async (userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    throw new Error("Invalid payment signature.");
  }

  const order = await prisma.order.update({
    where: { razorpayOrderId: razorpay_order_id },
    data: {
      status: "COMPLETED",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { plan: order.plan },
  });

  if (order.couponCode) {
    await prisma.coupon.update({
      where: { code: order.couponCode },
      data: { usedCount: { increment: 1 } },
    }).catch(() => {});
  }

  return { success: true, plan: order.plan };
};
