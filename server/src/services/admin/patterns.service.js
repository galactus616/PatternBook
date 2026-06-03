import { prisma } from "../../db/client.js";

export const getPatterns = async () => {
    const patterns = await prisma.pattern.findMany({
        include: { 
            topic: { select: { name: true } },
            _count: { select: { problems: true } }
        }
    });
    
    return patterns.map(p => ({
        ...p,
        topic: p.topic?.name || '',
        problemCount: p._count.problems,
        difficulty: 'MEDIUM'
    }));
};

export const createPattern = async (data) => {
    const { name, slug, topicId } = data;
    const pattern = await prisma.pattern.create({
        data: { name, slug, topicId },
        include: { topic: { select: { name: true } } }
    });
    
    return { ...pattern, topic: pattern.topic.name, problemCount: 0, difficulty: 'MEDIUM' };
};

export const updatePattern = async (id, data) => {
    const { name, slug, topicId } = data;
    const pattern = await prisma.pattern.update({
        where: { id },
        data: { name, slug, topicId },
        include: { topic: { select: { name: true } } }
    });
    
    return { ...pattern, topic: pattern.topic.name };
};

export const deletePattern = async (id) => {
    return prisma.pattern.delete({ where: { id } });
};
