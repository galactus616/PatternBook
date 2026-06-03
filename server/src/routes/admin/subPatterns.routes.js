import express from 'express';
import { getSubPatterns, createSubPattern, updateSubPattern, deleteSubPattern } from '../../controllers/admin/subPatterns.controller.js';
import { requirePermission } from '../../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', getSubPatterns);
router.post('/', requirePermission('subpatterns:create'), createSubPattern);
router.put('/:id', requirePermission('subpatterns:edit'), updateSubPattern);
router.delete('/:id', requirePermission('subpatterns:delete'), deleteSubPattern);

export default router;
