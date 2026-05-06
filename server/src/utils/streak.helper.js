import { prisma } from "../db/client.js";

/**
 * Calculates and updates user streak based on 5:30 AM boundary.
 * If user sits to learn at 2 AM, it still counts as the previous day.
 */
export const updateStreak = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, longestStreak: true, lastActiveDate: true }
  });

  if (!user) return;

  const now = new Date();
  
  // Apply 5:30 AM shift (Subtract 5 hours 30 mins)
  // This makes the day transition at 5:30 AM instead of midnight
  const getShiftedDate = (date) => {
    const d = new Date(date);
    d.setHours(d.getHours() - 5);
    d.setMinutes(d.getMinutes() - 30);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const todayStr = getShiftedDate(now);
  const lastActiveStr = user.lastActiveDate ? getShiftedDate(user.lastActiveDate) : null;

  if (todayStr === lastActiveStr) {
    // Already active today, no change needed
    return user;
  }

  let newStreak = 1;
  
  if (lastActiveStr) {
    const today = new Date(todayStr);
    const lastDay = new Date(lastActiveStr);
    
    // Difference in days
    const diffTime = Math.abs(today - lastDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Active yesterday, increment streak
      newStreak = user.currentStreak + 1;
    } else {
      // Missed a day, reset to 1
      newStreak = 1;
    }
  }

  const updatedLongest = Math.max(newStreak, user.longestStreak);

  return await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: updatedLongest,
      lastActiveDate: now
    }
  });
};
