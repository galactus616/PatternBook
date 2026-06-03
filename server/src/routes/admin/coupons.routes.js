import express from 'express';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon } from '../../controllers/admin/coupons.controller.js';
import { requirePermission } from '../../middleware/admin.middleware.js';

const router = express.Router();

router.get('/', requirePermission('payments:view'), getCoupons);
router.post('/', requirePermission('coupons:create'), createCoupon);
router.put('/:id', requirePermission('coupons:edit'), updateCoupon);
router.delete('/:id', requirePermission('coupons:delete'), deleteCoupon);
router.patch('/:id/toggle', requirePermission('coupons:edit'), toggleCoupon);

export default router;
