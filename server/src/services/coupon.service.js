import { prisma } from "../db/client.js";

/**
 * Validates a coupon code for a specific user
 * { coupon, discountedAmount }
 */
export const validateCoupon = async (code, userId, originalAmount) => {
  if (!code) return { coupon: null, discountedAmount: originalAmount };

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      usages: {
        where: { userId }
      }
    }
  });

  if (!coupon || !coupon.isActive) {
    throw new Error("Invalid or inactive coupon code");
  }

  // Check expiry
  if (coupon.expiryDate && new Date() > coupon.expiryDate) {
    throw new Error("Coupon has expired");
  }

  // Check global usage limit
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new Error("Coupon usage limit reached");
  }

  // Check if this specific user already used it
  if (coupon.usages.length > 0) {
    throw new Error("You have already used this coupon");
  }

  // Calculate discount
  let discountedAmount = originalAmount;
  if (coupon.discountType === "PERCENTAGE") {
    const discount = (originalAmount * coupon.discountValue) / 100;
    discountedAmount = originalAmount - discount;
  } else if (coupon.discountType === "FLAT") {
    discountedAmount = originalAmount - coupon.discountValue;
  }

  // Ensure amount doesn't go below zero
  discountedAmount = Math.max(0, Math.round(discountedAmount));

  return { coupon, discountedAmount };
};

/**
 * Record coupon usage (called after successful payment)
 */
export const recordUsage = async (couponId, userId) => {
  await prisma.$transaction([
    prisma.couponUsage.create({
      data: {
        userId,
        couponId,
      },
    }),
    prisma.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: { increment: 1 },
      },
    }),
  ]);
};
