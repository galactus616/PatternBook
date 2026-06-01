import { prisma } from "../db/client.js";

// ── Dashboard / Stats ─────────────────────────────────────────────────────────

export const getStats = async (req, res) => {
    try {
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

        res.json({
            success: true,
            analytics: {
                totalUsers, totalTopics, totalPatterns, totalProblems,
                easyProblems, mediumProblems, hardProblems,
                proUsers, teamUsers, totalSolves
            },
            revenueStats,
            transactions: txPayload
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── Topics ────────────────────────────────────────────────────────────────────

export const getTopics = async (req, res) => {
    try {
        const topics = await prisma.topic.findMany({
            include: { _count: { select: { problems: true } } },
            orderBy: { order: 'asc' }
        });
        
        res.json({
            success: true,
            topics: topics.map(t => ({ ...t, problemCount: t._count.problems }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTopic = async (req, res) => {
    try {
        const topic = await prisma.topic.create({ data: req.body });
        res.status(201).json({ success: true, topic: { ...topic, problemCount: 0 } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateTopic = async (req, res) => {
    try {
        const topic = await prisma.topic.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json({ success: true, topic });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteTopic = async (req, res) => {
    try {
        await prisma.topic.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ── Patterns ──────────────────────────────────────────────────────────────────

export const getPatterns = async (req, res) => {
    try {
        const patterns = await prisma.pattern.findMany({
            include: { 
                topic: { select: { name: true } },
                _count: { select: { problems: true } }
            }
        });
        res.json({
            success: true,
            patterns: patterns.map(p => ({
                ...p,
                topic: p.topic?.name || '',
                problemCount: p._count.problems,
                difficulty: 'MEDIUM' // Backend default, adjust as needed or map from problems
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createPattern = async (req, res) => {
    try {
        // req.body might include extra frontend fields, pick the ones we need
        const { name, slug, topicId } = req.body;
        const pattern = await prisma.pattern.create({
            data: { name, slug, topicId },
            include: { topic: { select: { name: true } } }
        });
        res.status(201).json({ 
            success: true, 
            pattern: { ...pattern, topic: pattern.topic.name, problemCount: 0, difficulty: 'MEDIUM' } 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updatePattern = async (req, res) => {
    try {
        const { name, slug, topicId } = req.body;
        const pattern = await prisma.pattern.update({
            where: { id: req.params.id },
            data: { name, slug, topicId },
            include: { topic: { select: { name: true } } }
        });
        res.json({ success: true, pattern: { ...pattern, topic: pattern.topic.name } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deletePattern = async (req, res) => {
    try {
        await prisma.pattern.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ── SubPatterns ───────────────────────────────────────────────────────────────

export const getSubPatterns = async (req, res) => {
    try {
        const subPatterns = await prisma.subPattern.findMany({
            include: { 
                pattern: { select: { name: true } },
                _count: { select: { problems: true } }
            }
        });
        res.json({
            success: true,
            subPatterns: subPatterns.map(sp => ({
                ...sp,
                pattern: sp.pattern?.name || '',
                problemCount: sp._count.problems
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createSubPattern = async (req, res) => {
    try {
        const { name, slug, patternId } = req.body;
        const subPattern = await prisma.subPattern.create({
            data: { name, slug, patternId },
            include: { pattern: { select: { name: true } } }
        });
        res.status(201).json({ 
            success: true, 
            subPattern: { ...subPattern, pattern: subPattern.pattern.name, problemCount: 0 } 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateSubPattern = async (req, res) => {
    try {
        const { name, slug, patternId } = req.body;
        const subPattern = await prisma.subPattern.update({
            where: { id: req.params.id },
            data: { name, slug, patternId },
            include: { pattern: { select: { name: true } } }
        });
        res.json({ success: true, subPattern: { ...subPattern, pattern: subPattern.pattern.name } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteSubPattern = async (req, res) => {
    try {
        await prisma.subPattern.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ── Problems ──────────────────────────────────────────────────────────────────

export const getProblems = async (req, res) => {
    try {
        const problems = await prisma.problem.findMany({
            include: {
                topic: { select: { name: true } },
                pattern: { select: { name: true } },
                subPattern: { select: { name: true } },
                _count: { select: { progress: { where: { status: { in: ['SOLVED_INDEPENDENTLY', 'SOLVED_WITH_HELP'] } } } } }
            },
            orderBy: [{ topicId: 'asc' }, { order: 'asc' }]
        });
        res.json({
            success: true,
            problems: problems.map(p => {
                const { _count, ...rest } = p;
                return {
                    ...rest,
                    topic: p.topic?.name || '',
                    pattern: p.pattern?.name || null,
                    subPattern: p.subPattern?.name || null,
                    solved: _count.progress
                };
            })
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProblem = async (req, res) => {
    try {
        const data = { ...req.body };
        delete data.topic; delete data.pattern; delete data.subPattern; delete data.solved; delete data._count;
        
        if (!data.patternId) data.patternId = null;
        if (!data.subPatternId) data.subPatternId = null;

        const problem = await prisma.problem.create({
            data,
            include: { topic: true, pattern: true, subPattern: true }
        });
        res.status(201).json({ 
            success: true, 
            problem: { 
                ...problem, 
                topic: problem.topic?.name, 
                pattern: problem.pattern?.name, 
                subPattern: problem.subPattern?.name, 
                solved: 0 
            } 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateProblem = async (req, res) => {
    try {
        const data = { ...req.body };
        delete data.topic; delete data.pattern; delete data.subPattern; delete data.solved; delete data.id; delete data.createdAt; delete data.updatedAt; delete data._count;

        if (data.patternId === '') data.patternId = null;
        if (data.subPatternId === '') data.subPatternId = null;

        const problem = await prisma.problem.update({
            where: { id: req.params.id },
            data,
            include: { topic: true, pattern: true, subPattern: true }
        });
        res.json({ 
            success: true, 
            problem: { 
                ...problem, 
                topic: problem.topic?.name, 
                pattern: problem.pattern?.name, 
                subPattern: problem.subPattern?.name 
            } 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteProblem = async (req, res) => {
    try {
        await prisma.problem.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: { select: { progress: { where: { status: { in: ['SOLVED_INDEPENDENTLY', 'SOLVED_WITH_HELP'] } } } } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            users: users.map(u => ({
                id: u.id,
                name: u.name || 'Unknown',
                email: u.email,
                role: u.role,
                permissions: u.permissions || [],
                plan: u.plan,
                joined: u.createdAt.toISOString().split('T')[0],
                solvedCount: u._count.progress,
                subscriptionStatus: u.subscriptionStatus
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        // Only allow changing role, permissions, and plan from admin
        const { role, permissions, plan } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { role, permissions, plan }
        });
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ── Coupons ───────────────────────────────────────────────────────────────────

export const getCoupons = async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            coupons: coupons.map(c => ({
                ...c,
                expiryDate: c.expiryDate ? c.expiryDate.toISOString().split('T')[0] : null,
                createdAt: c.createdAt.toISOString().split('T')[0]
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, maxUses, isActive } = req.body;
        const coupon = await prisma.coupon.create({
            data: {
                code, discountType, discountValue,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                maxUses: maxUses || null,
                isActive
            }
        });
        res.status(201).json({ success: true, coupon: { ...coupon, expiryDate: coupon.expiryDate ? coupon.expiryDate.toISOString().split('T')[0] : null } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiryDate, maxUses, isActive } = req.body;
        const coupon = await prisma.coupon.update({
            where: { id: req.params.id },
            data: {
                code, discountType, discountValue,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                maxUses: maxUses || null,
                isActive
            }
        });
        res.json({ success: true, coupon: { ...coupon, expiryDate: coupon.expiryDate ? coupon.expiryDate.toISOString().split('T')[0] : null } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        await prisma.coupon.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const toggleCoupon = async (req, res) => {
    try {
        const existing = await prisma.coupon.findUnique({ where: { id: req.params.id } });
        const coupon = await prisma.coupon.update({
            where: { id: req.params.id },
            data: { isActive: !existing.isActive }
        });
        res.json({ success: true, coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
