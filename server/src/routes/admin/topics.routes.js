import express from 'express';
import { getTopics, createTopic, updateTopic, deleteTopic } from '../../controllers/admin/topics.controller.js';
import { requirePermission } from '../../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', getTopics);
router.post('/', requirePermission('topics:create'), createTopic);
router.put('/:id', requirePermission('topics:edit'), updateTopic);
router.delete('/:id', requirePermission('topics:delete'), deleteTopic);

export default router;
