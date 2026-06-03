import { prisma } from "../../db/client.js";

export const getUsers = async () => {
    const users = await prisma.user.findMany({
        include: {
            _count: { select: { progress: { where: { status: { in: ['SOLVED_INDEPENDENTLY', 'SOLVED_WITH_HELP'] } } } } }
        },
        orderBy: { createdAt: 'desc' }
    });
    
    return users.map(u => ({
        id: u.id,
        name: u.name || 'Unknown',
        email: u.email,
        role: u.role,
        permissions: u.permissions || [],
        plan: u.plan,
        joined: u.createdAt.toISOString().split('T')[0],
        solvedCount: u._count.progress,
        subscriptionStatus: u.subscriptionStatus
    }));
};

export const updateUser = async (id, data) => {
    const { role, permissions, plan } = data;
    return prisma.user.update({
        where: { id },
        data: { role, permissions, plan }
    });
};
