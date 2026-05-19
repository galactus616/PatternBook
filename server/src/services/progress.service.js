import { prisma } from "../db/client.js";
import { updateStreak } from "../utils/streak.helper.js";
import * as notificationService from "./notification.service.js";

export const upsertProgress = async ({
  userId,
  problemId,
  status,
  notes,
  attempts,
}) => {
  if (!userId || !problemId) {
    throw new Error("userId and problemId are required");
  }

  const [progress] = await Promise.all([
    prisma.userProgress.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
      update: {
        ...(status && { status }),
        ...(notes && { notes }),
        ...(attempts !== undefined && { attempts }),
        lastReviewed: new Date(),
      },
      create: {
        userId,
        problemId,
        status: status || "NOT_STARTED",
        notes: notes || "",
        attempts: attempts || 0,
        lastReviewed: new Date(),
      },
    }),
    updateStreak(userId)
  ]);

  if (status === "SOLVED_INDEPENDENTLY") {
    try {
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        include: {
          pattern: {
            include: {
              problems: { select: { id: true } }
            }
          }
        }
      });

      if (problem && problem.pattern) {
        const patternId = problem.pattern.id;
        const totalProblems = problem.pattern.problems.length;

        const solvedCount = await prisma.userProgress.count({
          where: {
            userId,
            status: "SOLVED_INDEPENDENTLY",
            problem: { patternId }
          }
        });

        if (solvedCount === totalProblems && totalProblems > 0) {
          const alreadyNotified = await prisma.notification.findFirst({
            where: {
              userId,
              type: "SYSTEM",
              referenceId: patternId,
              message: { contains: "mastered the" }
            }
          });

          if (!alreadyNotified) {
            notificationService.createNotification(
              userId,
              "SYSTEM",
              `Congratulations! You have mastered the ${problem.pattern.name} pattern.`,
              patternId
            );

            const userRecord = await prisma.user.findUnique({
              where: { id: userId },
              select: { name: true, username: true }
            });
            const displayName = userRecord.name || userRecord.username || "A user";

            const friendships = await prisma.friendship.findMany({
              where: {
                OR: [
                  { senderId: userId, status: "ACCEPTED" },
                  { receiverId: userId, status: "ACCEPTED" }
                ]
              }
            });

            const friendIds = friendships.map(f => f.senderId === userId ? f.receiverId : f.senderId);

            friendIds.forEach(friendId => {
              notificationService.createNotification(
                friendId,
                "SYSTEM",
                `Your friend ${displayName} just mastered the ${problem.pattern.name} pattern!`,
                patternId
              );
            });
          }
        }
      }
    } catch (err) {
      console.error("Error in pattern completion notification:", err);
    }
  }

  return progress;
};

export const fetchUserProgress = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  return prisma.userProgress.findMany({
    where: { userId },

    include: {
      problem: {
        include: {
          pattern: true,
          subPattern: true,
        },
      },
    },

    orderBy: {
      updatedAt: "desc",
    },
  });
};