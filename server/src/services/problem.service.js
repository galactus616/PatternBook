import { prisma } from "../db/client.js";

export const getAllProblems = async (filters, userId) => {
    const { topic } = filters;

    return prisma.problem.findMany({
        where: {
            ...(topic && {
                topic: {
                    name: topic,
                },
            }),
        },

        include: {
            pattern: true,
            subPattern: true,
            topic: true,
            progress: {
                where: {
                    userId: userId
                },
                select: {
                    status: true,
                    notes: true,
                    attempts: true
                }
            }
        },

        orderBy: {
            order: "asc",
        },
    });
};