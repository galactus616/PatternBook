import { prisma } from "../db/client.js";

export const checkSubscriptionExpiry = async (req, res, next) => {
  try {
    const { userId, plan } = req.user;

    if (plan !== "PRO" && plan !== "TEAM") return next();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionEndsAt: true, plan: true },
    });

    if (!user) return next();

    if (user.subscriptionEndsAt && new Date() > new Date(user.subscriptionEndsAt)) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "FREE",
          subscriptionStatus: "CANCELLED",
        },
      });

      req.user.plan = "FREE";
    }

    next();
  } catch (err) {
    console.error("Subscription expiry check failed:", err.message);
    next();
  }
};
