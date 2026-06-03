import * as couponsService from '../../services/admin/coupons.service.js';

export const getCoupons = async (req, res) => {
    try {
        const coupons = await couponsService.getCoupons();
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCoupon = async (req, res) => {
    try {
        const coupon = await couponsService.createCoupon(req.body);
        res.status(201).json({ success: true, coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const coupon = await couponsService.updateCoupon(req.params.id, req.body);
        res.json({ success: true, coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        await couponsService.deleteCoupon(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const toggleCoupon = async (req, res) => {
    try {
        const coupon = await couponsService.toggleCoupon(req.params.id);
        res.json({ success: true, coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
