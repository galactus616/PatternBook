import { prisma } from "../db/client.js";

export const getAllProblems = async (filters, userId, userPlan = "FREE") => {
    const { topic, difficulty, priority, pattern } = filters;

    const where = {};

    // Topic filter — supports both topic name and slug
    if (topic) {
        const matchingTopic = await prisma.topic.findFirst({
            where: {
                OR: [{ name: topic }, { slug: topic }],
            },
            select: { id: true },
        });
        if (matchingTopic) {
            where.topicId = matchingTopic.id;
        } else {
            // No matching topic → return empty
            return [];
        }
    }

    if (difficulty) {
        where.difficulty = difficulty;
    }

    if (priority) {
        where.priority = priority;
    }

    // Pattern filter — supports both pattern name and slug
    if (pattern) {
        const matchingPattern = await prisma.pattern.findFirst({
            where: {
                OR: [{ name: pattern }, { slug: pattern }],
            },
            select: { id: true },
        });
        if (matchingPattern) {
            where.patternId = matchingPattern.id;
        } else {
            return [];
        }
    }

    const problems = await prisma.problem.findMany({
        where,

        select: {
            id: true,
            title: true,
            difficulty: true,
            priority: true,
            isPro: true,
            timeEstimate: true,
            hint: true,
            leetcodeUrl: true,
            pattern: {
                select: { name: true }
            },
            subPattern: {
                select: { name: true }
            },
            progress: {
                where: userId ? { userId } : { userId: "unauthenticated" },
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