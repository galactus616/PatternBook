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

  if (data.username) {
    const existing = await prisma.user.findFirst({
      where: { 
        username: data.username,
        NOT: { id: userId }
      }
    });
    if (existing) throw new Error("Username is already taken");
    
    if (!/^[a-z0-9_]{3,20}$/.test(data.username)) {
      throw new Error("Username must be 3-20 characters and only contain lowercase letters, numbers, and underscores");
    }
    
    updateData.username = data.username;
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
      username: true,
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
  await prisma.userProgress.deleteMany({
    where: { userId },
  });

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
  await prisma.userProgress.deleteMany({ where: { userId } });
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.couponUsage.deleteMany({ where: { userId } });
  
  await prisma.user.delete({ where: { id: userId } });

  return { success: true };
};

export const checkUsername = async (username, excludeUserId = null) => {
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) return { available: true };
  if (excludeUserId && user.id === excludeUserId) return { available: true };

  return { available: false };
};
