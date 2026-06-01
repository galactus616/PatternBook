import express from 'express';
import {
    getStats,
    getTopics, createTopic, updateTopic, deleteTopic,
    getPatterns, createPattern, updatePattern, deletePattern,
    getSubPatterns, createSubPattern, updateSubPattern, deleteSubPattern,
    getProblems, createProblem, updateProblem, deleteProblem,
    getUsers, updateUser,
    getCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon
} from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole, requirePermission } from '../middleware/admin.middleware.js';

const router = express.Router();

// All admin routes require a valid user and at least MODERATOR role
router.use(authMiddleware);
router.use(requireRole(['ADMIN', 'MODERATOR']));

// Dashboard Stats & Initial Data (Needs View Access)
// (We could require 'payments:view' for revenue stats, but for simplicity, we'll let all admins/mods view the dashboard structure)
router.get('/stats', getStats);

// ── Topics ──
router.get('/topics', getTopics);
router.post('/topics', requirePermission('topics:create'), createTopic);
router.put('/topics/:id', requirePermission('topics:edit'), updateTopic);
router.delete('/topics/:id', requirePermission('topics:delete'), deleteTopic);

// ── Patterns ──
router.get('/patterns', getPatterns);
router.post('/patterns', requirePermission('patterns:create'), createPattern);
router.put('/patterns/:id', requirePermission('patterns:edit'), updatePattern);
router.delete('/patterns/:id', requirePermission('patterns:delete'), deletePattern);

// ── SubPatterns ──
router.get('/sub-patterns', getSubPatterns);
router.post('/sub-patterns', requirePermission('subpatterns:create'), createSubPattern);
router.put('/sub-patterns/:id', requirePermission('subpatterns:edit'), updateSubPattern);
router.delete('/sub-patterns/:id', requirePermission('subpatterns:delete'), deleteSubPattern);

// ── Problems ──
router.get('/problems', getProblems);
router.post('/problems', requirePermission('problems:create'), createProblem);
router.put('/problems/:id', requirePermission('problems:edit'), updateProblem);
router.delete('/problems/:id', requirePermission('problems:delete'), deleteProblem);

// ── Users ──
router.get('/users', requirePermission('users:view'), getUsers);
router.put('/users/:id', requirePermission('users:promote'), updateUser);

// ── Coupons ──
router.get('/coupons', requirePermission('payments:view'), getCoupons);
router.post('/coupons', requirePermission('coupons:create'), createCoupon);
router.put('/coupons/:id', requirePermission('coupons:edit'), updateCoupon);
router.delete('/coupons/:id', requirePermission('coupons:delete'), deleteCoupon);
router.patch('/coupons/:id/toggle', requirePermission('coupons:edit'), toggleCoupon);

export default router;
