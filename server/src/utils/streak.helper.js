import { prisma } from "../db/client.js";
import * as notificationService from "../services/notification.service.js";

export const updateStreak = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, longestStreak: true, lastActiveDate: true }
  });

  if (!user) return;

  const now = new Date();
  
  const getShiftedDate = (date) => {
    const d = new Date(date);
    d.setHours(d.getHours() - 5);
    d.setMinutes(d.getMinutes() - 30);
    return d.toISOString().split('T')[0];
  };

  const todayStr = getShiftedDate(now);
  const lastActiveStr = user.lastActiveDate ? getShiftedDate(user.lastActiveDate) : null;

  if (todayStr === lastActiveStr) {
    return user;
  }

  let newStreak = 1;
  
  if (lastActiveStr) {
    const today = new Date(todayStr);
    const lastDay = new Date(lastActiveStr);
    
    const diffTime = Math.abs(today - lastDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak = user.currentStreak + 1;
    } else {
      newStreak = 1;
    }
  }

  const updatedLongest = Math.max(newStreak, user.longestStreak);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: updatedLongest,
      lastActiveDate: now
    }
  });

  notificationService.createNotification(
    userId,
    "SYSTEM",
    `You are on a ${newStreak}-day solving streak. Keep it going today.`
  );

  return updatedUser;
};
