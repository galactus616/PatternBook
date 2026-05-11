import { prisma } from "../db/client.js";

/**
 * Checks if a Pro user's subscription has expired.
 * If so, downgrades them to FREE in the DB.
 * Should run AFTER authMiddleware on protected routes.
 */
export const checkSubscriptionExpiry = async (req, res, next) => {
  try {
    const { userId, plan } = req.user;

    // Only check for PRO/TEAM users
    if (plan !== "PRO" && plan !== "TEAM") return next();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionEndsAt: true, plan: true },
    });

    if (!user) return next();

    // If expiry date exists and has passed → downgrade
    if (user.subscriptionEndsAt && new Date() > new Date(user.subscriptionEndsAt)) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "FREE",
          subscriptionStatus: "CANCELLED",
        },
      });

      // Reflect downgrade in the request context for this request
      req.user.plan = "FREE";
    }

    next();
  } catch (err) {
    // Non-blocking — if check fails, proceed normally
    console.error("Subscription expiry check failed:", err.message);
    next();
  }
};
