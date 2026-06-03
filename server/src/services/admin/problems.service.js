import { prisma } from "../../db/client.js";

export const getProblems = async () => {
    const problems = await prisma.problem.findMany({
        include: {
            topic: { select: { name: true } },
            pattern: { select: { name: true } },
            subPattern: { select: { name: true } },
            _count: { select: { progress: { where: { status: { in: ['SOLVED_INDEPENDENTLY', 'SOLVED_WITH_HELP'] } } } } }
        },
        orderBy: [{ topicId: 'asc' }, { order: 'asc' }]
    });
    
    return problems.map(p => {
        const { _count, ...rest } = p;
        return {
            ...rest,
            topic: p.topic?.name || '',
            pattern: p.pattern?.name || null,
            subPattern: p.subPattern?.name || null,
            solved: _count.progress
        };
    });
};

export const createProblem = async (data) => {
    const problemData = { ...data };
    delete problemData.topic; delete problemData.pattern; delete problemData.subPattern; delete problemData.solved; delete problemData._count;
    
    if (!problemData.patternId) problemData.patternId = null;
    if (!problemData.subPatternId) problemData.subPatternId = null;

    const problem = await prisma.problem.create({
        data: problemData,
        include: { topic: true, pattern: true, subPattern: true }
    });
    
    return { 
        ...problem, 
        topic: problem.topic?.name, 
        pattern: problem.pattern?.name, 
        subPattern: problem.subPattern?.name, 
        solved: 0 
    };
};

export const updateProblem = async (id, data) => {
    const problemData = { ...data };
    delete problemData.topic; delete problemData.pattern; delete problemData.subPattern; delete problemData.solved; delete problemData.id; delete problemData.createdAt; delete problemData.updatedAt; delete problemData._count;

    if (problemData.patternId === '') problemData.patternId = null;
    if (problemData.subPatternId === '') problemData.subPatternId = null;

    const problem = await prisma.problem.update({
        where: { id },
        data: problemData,
        include: { topic: true, pattern: true, subPattern: true }
    });
    
    return { 
        ...problem, 
        topic: problem.topic?.name, 
        pattern: problem.pattern?.name, 
        subPattern: problem.subPattern?.name 
    };
};

export const deleteProblem = async (id) => {
    return prisma.problem.delete({ where: { id } });
};
