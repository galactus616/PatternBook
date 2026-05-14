import { prisma } from "../db/client.js";
import bcrypt from "bcrypt";

export const updateProfile = async (userId, data) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const updateData = {};

  if (data.name) {
    updateData.name = data.name;
  }

  if (data.picture) {
    updateData.picture = data.picture;
    updateData.hasCustomPicture = true;
  }

  if (data.newPassword && data.currentPassword) {
    if (user.provider === "GOOGLE") {
      throw new Error("Cannot change password for Google accounts");
    }
    const isMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Incorrect current password");
    }
    updateData.password = await bcrypt.hash(data.newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      provider: true,
      plan: true,
      createdAt: true,
      subscriptionEndsAt: true,
      currentStreak: true,
      longestStreak: true,
    },
  });

  return updatedUser;
};

export const exportData = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  const progress = await prisma.userProgress.findMany({
    where: { userId },
    include: { problem: { select: { title: true, difficulty: true } } },
  });

  return {
    user,
    progress,
    exportDate: new Date(),
  };
};

export const resetProgress = async (userId) => {
  // Delete all progress
  await prisma.userProgress.deleteMany({
    where: { userId },
  });

  // Reset streaks
  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: 0,
      longestStreak: 0,
    },
  });

  return { success: true };
};

export const deleteAccount = async (userId) => {
  // Prisma relations will cascade delete or we might need to delete manually depending on schema
  // We'll delete progress and transactions first to be safe
  await prisma.userProgress.deleteMany({ where: { userId } });
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.couponUsage.deleteMany({ where: { userId } });
  
  await prisma.user.delete({ where: { id: userId } });

  return { success: true };
};
