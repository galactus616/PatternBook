import express from 'express';
import { getUsers, updateUser } from '../../controllers/admin/users.controller.js';
import { requirePermission } from '../../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', requirePermission('users:view'), getUsers);
router.put('/:id', requirePermission('users:promote'), updateUser);

export default router;
