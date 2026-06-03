import express from 'express';
import { getPatterns, createPattern, updatePattern, deletePattern } from '../../controllers/admin/patterns.controller.js';
import { requirePermission } from '../../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', getPatterns);
router.post('/', requirePermission('patterns:create'), createPattern);
router.put('/:id', requirePermission('patterns:edit'), updatePattern);
router.delete('/:id', requirePermission('patterns:delete'), deletePattern);

export default router;
