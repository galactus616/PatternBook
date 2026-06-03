import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/admin.middleware.js';

import statsRoutes from './stats.routes.js';
import topicsRoutes from './topics.routes.js';
import patternsRoutes from './patterns.routes.js';
import subPatternsRoutes from './subPatterns.routes.js';
import problemsRoutes from './problems.routes.js';
import usersRoutes from './users.routes.js';
import couponsRoutes from './coupons.routes.js';

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(['ADMIN', 'MODERATOR']));

router.use('/stats', statsRoutes);
router.use('/topics', topicsRoutes);
router.use('/patterns', patternsRoutes);
router.use('/sub-patterns', subPatternsRoutes);
router.use('/problems', problemsRoutes);
router.use('/users', usersRoutes);
router.use('/coupons', couponsRoutes);

export default router;
