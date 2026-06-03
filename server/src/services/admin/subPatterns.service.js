import { prisma } from "../../db/client.js";

export const getSubPatterns = async () => {
    const subPatterns = await prisma.subPattern.findMany({
        include: { 
            pattern: { select: { name: true } },
            _count: { select: { problems: true } }
        }
    });
    
    return subPatterns.map(sp => ({
        ...sp,
        pattern: sp.pattern?.name || '',
        problemCount: sp._count.problems
    }));
};

export const createSubPattern = async (data) => {
    const { name, slug, patternId } = data;
    const subPattern = await prisma.subPattern.create({
        data: { name, slug, patternId },
        include: { pattern: { select: { name: true } } }
    });
    
    return { ...subPattern, pattern: subPattern.pattern.name, problemCount: 0 };
};

export const updateSubPattern = async (id, data) => {
    const { name, slug, patternId } = data;
    const subPattern = await prisma.subPattern.update({
        where: { id },
        data: { name, slug, patternId },
        include: { pattern: { select: { name: true } } }
    });
    
    return { ...subPattern, pattern: subPattern.pattern.name };
};

export const deleteSubPattern = async (id) => {
    return prisma.subPattern.delete({ where: { id } });
};
