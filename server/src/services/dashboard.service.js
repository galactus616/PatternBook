import { prisma } from "../db/client.js";

export const getDashboardStats = async (userId) => {
  // 1. Get User and Overall Stats
  const [user, totalProblems, userProgress] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, longestStreak: true, lastActiveDate: true }
    }),
    prisma.problem.count(),
    prisma.userProgress.findMany({
      where: { userId },
      select: {
        status: true,
        problem: {
          select: {
            difficulty: true,
            topicId: true
          }
        }
      }
    })
  ]);

  const solvedCount = userProgress.filter(p => p.status === 'SOLVED_INDEPENDENTLY').length;
  const attemptedCount = userProgress.filter(p => p.status === 'ATTEMPTED' || p.status === 'SOLVED_WITH_HELP').length;

  // 2. Breakdown by Difficulty
  const difficultyStats = {
    EASY: { total: 0, solved: 0 },
    MEDIUM: { total: 0, solved: 0 },
    HARD: { total: 0, solved: 0 }
  };

  // Get total difficulty counts from all problems
  const allProblemsDifficulty = await prisma.problem.groupBy({
    by: ['difficulty'],
    _count: true
  });

  allProblemsDifficulty.forEach(stat => {
    difficultyStats[stat.difficulty].total = stat._count;
  });

  // Calculate solved per difficulty
  userProgress.forEach(p => {
    if (p.status === 'SOLVED_INDEPENDENTLY') {
      difficultyStats[p.problem.difficulty].solved++;
    }
  });

  // 3. Topic-wise Progress
  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { problems: true }
      }
    }
  });

  const topicProgress = topics.map(topic => {
    const solvedInTopic = userProgress.filter(p => 
      p.problem.topicId === topic.id && p.status === 'SOLVED_INDEPENDENTLY'
    ).length;

    return {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      order: topic.order,
      totalProblems: topic._count.problems,
      solvedProblems: solvedInTopic,
      percentage: topic._count.problems > 0 
        ? Math.round((solvedInTopic / topic._count.problems) * 100) 
        : 0
    };
  });

  // 4. Recent Activity
  const recentActivity = await prisma.userProgress.findMany({
    where: { userId },
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: {
      problem: {
        select: {
          title: true,
          difficulty: true,
          pattern: { select: { name: true } }
        }
      }
    }
  });

  return {
    overall: {
      totalProblems,
      solvedCount,
      attemptedCount,
      masteryPercentage: totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0,
      currentStreak: user?.currentStreak || 0,
      longestStreak: user?.longestStreak || 0,
      lastActiveDate: user?.lastActiveDate
    },
    difficultyStats,
    topicProgress,
    recentActivity
  };
};
