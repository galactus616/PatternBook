import { prisma } from "../db/client.js";

export const getPublicProfile = async (identifier, viewerId = null) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  const [user, totalProblems] = await Promise.all([
    prisma.user.findUnique({
      where: isUuid ? { id: identifier } : { username: identifier },
      select: {
        id: true,
        name: true,
        username: true,
        picture: true,
        plan: true,
        currentStreak: true,
        longestStreak: true,
        createdAt: true,
      },
    }),
    prisma.problem.count(),
  ]);

  if (!user) return null;

  let friendshipStatus = "NONE";
  let requestId = null;

  if (viewerId && viewerId !== user.id) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: viewerId, receiverId: user.id },
          { senderId: user.id, receiverId: viewerId }
        ]
      }
    });

    if (friendship) {
      requestId = friendship.id;
      if (friendship.status === "ACCEPTED") {
        friendshipStatus = "FRIEND";
      } else if (friendship.status === "PENDING") {
        friendshipStatus = friendship.senderId === viewerId ? "PENDING_SENT" : "PENDING_RECEIVED";
      }
    }
  } else if (viewerId === user.id) {
    friendshipStatus = "SELF";
  }

  const userProgress = await prisma.userProgress.findMany({
    where: { userId: user.id },
    select: {
      status: true,
      updatedAt: true,
      problem: {
        select: {
          difficulty: true,
          topicId: true,
          patternId: true,
        },
      },
    },
  });

  if (!user) return null;

  const solvedCount = userProgress.filter(
    (p) => p.status === "SOLVED_INDEPENDENTLY"
  ).length;

  const masteryPercentage =
    totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  const getRank = (count) => {
    if (count >= 300) return "Architect";
    if (count >= 150) return "Grandmaster";
    if (count >= 75) return "Specialist";
    if (count >= 30) return "Apprentice";
    return "Novice";
  };

  const difficultyStats = { EASY: 0, MEDIUM: 0, HARD: 0 };
  userProgress.forEach((p) => {
    if (p.status === "SOLVED_INDEPENDENTLY") {
      difficultyStats[p.problem.difficulty]++;
    }
  });

  // Top patterns (top 6 by solved count)
  const patternMap = {};
  userProgress.forEach((p) => {
    if (p.status === "SOLVED_INDEPENDENTLY" && p.problem.patternId) {
      patternMap[p.problem.patternId] =
        (patternMap[p.problem.patternId] || 0) + 1;
    }
  });

  const topPatternIds = Object.entries(patternMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => id);

  const topPatterns = await prisma.pattern.findMany({
    where: { id: { in: topPatternIds } },
    select: { id: true, name: true },
  });

  const topPatternsWithCount = topPatterns.map((p) => ({
    name: p.name,
    solved: patternMap[p.id] || 0,
  }));

  // Heatmap (current year)
  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  const heatmapActivities = await prisma.userProgress.findMany({
    where: {
      userId: user.id,
      updatedAt: { gte: startOfYear, lte: endOfYear },
    },
    select: { updatedAt: true, status: true },
  });

  const heatmapMap = {};
  heatmapActivities.forEach((act) => {
    const date = act.updatedAt.toISOString().split("T")[0];
    if (!heatmapMap[date]) heatmapMap[date] = 0;
    if (act.status === "SOLVED_INDEPENDENTLY") heatmapMap[date] += 1;
  });

  const heatmapData = Object.keys(heatmapMap).map((date) => ({
    date,
    count: heatmapMap[date],
  }));

  // Member since duration
  const joinedDate = new Date(user.createdAt);
  const monthsActive = Math.max(
    1,
    Math.round(
      (new Date() - joinedDate) / (1000 * 60 * 60 * 24 * 30)
    )
  );

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    picture: user.picture,
    plan: user.plan,
    rank: getRank(solvedCount),
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    joinedDate: user.createdAt,
    monthsActive,
    stats: {
      totalProblems,
      solvedCount,
      masteryPercentage,
      difficultyStats,
    },
    topPatterns: topPatternsWithCount,
    heatmapData,
    friendshipStatus,
    requestId
  };
};
