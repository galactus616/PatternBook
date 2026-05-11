import { prisma } from "../db/client.js";

export const getAllProblems = async (filters, userId, userPlan = "FREE") => {
    const { topic } = filters;

    const problems = await prisma.problem.findMany({
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

    const isPremiumUser = userPlan === "PRO" || userPlan === "TEAM";

    return problems.map(prob => {
        if (prob.isPro && !isPremiumUser) {
            return {
                ...prob,
                leetcodeUrl: null,
                hint: null
            };
        }
        return prob;
    });
};