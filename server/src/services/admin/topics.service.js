import { prisma } from "../../db/client.js";

export const getTopics = async () => {
    const topics = await prisma.topic.findMany({
        include: {
            _count: { select: { problems: true } }
        },
        orderBy: { order: 'asc' }
    });
    
    return topics.map(t => ({
        ...t,
        problemCount: t._count.problems
    }));
};

export const createTopic = async (data) => {
    const { name, slug, order } = data;
    const topic = await prisma.topic.create({
        data: { name, slug, order }
    });
    
    return { ...topic, problemCount: 0 };
};

export const updateTopic = async (id, data) => {
    const { name, slug, order } = data;
    const topic = await prisma.topic.update({
        where: { id },
        data: { name, slug, order }
    });
    
    return topic;
};

export const deleteTopic = async (id) => {
    return prisma.topic.delete({ where: { id } });
};
