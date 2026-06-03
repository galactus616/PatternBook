import express from 'express';
import { getProblems, createProblem, updateProblem, deleteProblem } from '../../controllers/admin/problems.controller.js';
import { requirePermission } from '../../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', getProblems);
router.post('/', requirePermission('problems:create'), createProblem);
router.put('/:id', requirePermission('problems:edit'), updateProblem);
router.delete('/:id', requirePermission('problems:delete'), deleteProblem);

export default router;
