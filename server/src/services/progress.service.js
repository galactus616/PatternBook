import { prisma } from "../db/client.js";

export const upsertProgress = async ({ userId, problemId, status, notes, attempts }) => {
    return prisma.userProgress.upsert({
        where: {
            userId_problemId: {
                userId,
                problemId,
            },
        },

        update: {
            status,
            notes,
            attempts,
            lastReviewed: new Date(),
        },

        create: {
            userId,
            problemId,
            status,
            notes,
            attempts,
            lastReviewed: new Date(),
        },
    });
};

export const fetchUserProgress = async (userId) => {
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
    });
};