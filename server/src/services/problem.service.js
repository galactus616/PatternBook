import { prisma } from "../db/client.js";

export const getAllProblems = async (filters) => {
    const {
        difficulty,
        priority,
        pattern,
        subPattern,
        phase,
    } = filters;

    return prisma.problem.findMany({
        where: {
            ...(difficulty && { difficulty }),
            ...(priority && { priority }),
            ...(phase && { phase: Number(phase) }),

            ...(pattern && {
                pattern: {
                    name: pattern,
                },
            }),

            ...(subPattern && {
                subPattern: {
                    name: subPattern,
                },
            }),
        },

        include: {
            pattern: true,
            subPattern: true,
            topic: true,
        },

        orderBy: {
            order: "asc",
        },
    });
};