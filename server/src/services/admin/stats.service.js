import { prisma } from "../../db/client.js";

export const getStatsData = async () => {
    const [
        totalUsers, totalTopics, totalPatterns, totalProblems,
        easyProblems, mediumProblems, hardProblems,
        proUsers, teamUsers,
        totalSolves
    ] = await Promise.all([
        prisma.user.count(),
        prisma.topic.count(),
        prisma.pattern.count(),
        prisma.problem.count(),
        prisma.problem.count({ where: { difficulty: 'EASY' } }),
        prisma.problem.count({ where: { difficulty: 'MEDIUM' } }),
        prisma.problem.count({ where: { difficulty: 'HARD' } }),
        prisma.user.count({ where: { plan: 'PRO' } }),
        prisma.user.count({ where: { plan: 'TEAM' } }),
        prisma.userProgress.count({ where: { status: { in: ['SOLVED_INDEPENDENTLY', 'SOLVED_WITH_HELP'] } } })
    ]);

    const transactions = await prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
        include: { 
            user: { select: { name: true, email: true } },
            coupon: { select: { code: true } }
        }
    });

    const capturedTxs = transactions.filter(t => t.status === 'captured');
    const failedTxs = transactions.filter(t => t.status === 'failed');

    const revenueStats = {
        totalRevenue: capturedTxs.reduce((acc, t) => acc + t.amount, 0),
        successfulOrders: capturedTxs.length,
        failedOrders: failedTxs.length,
        planBreakdown: {
            FREE: await prisma.user.count({ where: { plan: 'FREE' } }),
            PRO: proUsers,
            TEAM: teamUsers,
        }
    };

    const txPayload = transactions.map(t => ({
        id: t.id,
        userName: t.user?.name || 'Unknown',
        email: t.user?.email || 'unknown@example.com',
        amount: t.amount,
        currency: t.currency,
        status: t.status,
        plan: t.plan,
        coupon: t.coupon?.code || null,
        razorpayOrderId: t.razorpayOrderId,
        createdAt: t.createdAt.toISOString().split('T')[0]
    }));

    return {
        analytics: {
            totalUsers, totalTopics, totalPatterns, totalProblems,
            easyProblems, mediumProblems, hardProblems,
            proUsers, teamUsers, totalSolves
        },
        revenueStats,
        transactions: txPayload
    };
};
