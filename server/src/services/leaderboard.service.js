import { prisma } from "../db/client.js";

export const getLeaderboardData = async (userId) => {
  // 1. Fetch all users and their solved independent progress
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      picture: true,
      plan: true,
      currentStreak: true,
      progress: {
        where: {
          status: "SOLVED_INDEPENDENTLY",
        },
        select: {
          problem: {
            select: {
              difficulty: true,
            },
          },
        },
      },
    },
  });

  // 2. Map users to include computed points and solvedStats
  const mappedUsers = users.map((user) => {
    let easy = 0;
    let medium = 0;
    let hard = 0;

    user.progress.forEach((prog) => {
      if (prog.problem) {
        if (prog.problem.difficulty === "EASY") {
          easy++;
        } else if (prog.problem.difficulty === "MEDIUM") {
          medium++;
        } else if (prog.problem.difficulty === "HARD") {
          hard++;
        }
      }
    });

    const points = easy * 10 + medium * 20 + hard * 30;

    return {
      id: user.id,
      name: user.name || "Anonymous Seeker",
      username: user.username || "seeker",
      picture: user.picture,
      plan: user.plan,
      points,
      streak: user.currentStreak,
      solvedStats: { easy, medium, hard },
    };
  });

  // 3. Sort by points descending (and fallback to streak/name for deterministic ordering)
  mappedUsers.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.streak !== a.streak) {
      return b.streak - a.streak;
    }
    return a.name.localeCompare(b.name);
  });

  // 4. Create global list with ranks
  const globalList = mappedUsers.map((u, index) => ({
    ...u,
    rank: index + 1,
  }));

  // 5. Fetch friends of the current user
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { senderId: userId, status: "ACCEPTED" },
        { receiverId: userId, status: "ACCEPTED" },
      ],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  const friendIds = new Set([userId]);
  friendships.forEach((f) => {
    friendIds.add(f.senderId);
    friendIds.add(f.receiverId);
  });

  // 6. Create friends list with ranks
  const friendsListRaw = mappedUsers.filter((u) => friendIds.has(u.id));
  const friendsList = friendsListRaw.map((u, index) => ({
    ...u,
    rank: index + 1,
  }));

  // 7. Calculate stats for global
  const globalStats = {
    totalSeekers: globalList.length,
    totalPoints: globalList.reduce((sum, u) => sum + u.points, 0),
    topStreak: globalList.length > 0 ? Math.max(...globalList.map((u) => u.streak)) : 0,
  };

  // 8. Calculate stats for friends
  const friendsStats = {
    totalSeekers: friendsList.length,
    totalPoints: friendsList.reduce((sum, u) => sum + u.points, 0),
    topStreak: friendsList.length > 0 ? Math.max(...friendsList.map((u) => u.streak)) : 0,
  };

  return {
    globalList,
    friendsList,
    stats: {
      global: globalStats,
      friends: friendsStats,
    },
  };
};
