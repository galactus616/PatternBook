import { prisma } from "../db/client.js";

// 🔥 UPSERT PROGRESS
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

  return prisma.userProgress.upsert({
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
  });
};

// 🔥 FETCH USER PROGRESS
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