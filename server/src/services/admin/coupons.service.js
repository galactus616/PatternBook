import { prisma } from "../../db/client.js";

export const getCoupons = async () => {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' }
    });
    
    return coupons.map(c => ({
        ...c,
        expiryDate: c.expiryDate ? c.expiryDate.toISOString().split('T')[0] : null,
        createdAt: c.createdAt.toISOString().split('T')[0]
    }));
};

export const createCoupon = async (data) => {
    const { code, discountType, discountValue, expiryDate, maxUses, isActive } = data;
    const coupon = await prisma.coupon.create({
        data: {
            code, discountType, discountValue,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            maxUses: maxUses || null,
            isActive
        }
    });
    
    return { ...coupon, expiryDate: coupon.expiryDate ? coupon.expiryDate.toISOString().split('T')[0] : null };
};

export const updateCoupon = async (id, data) => {
    const { code, discountType, discountValue, expiryDate, maxUses, isActive } = data;
    const coupon = await prisma.coupon.update({
        where: { id },
        data: {
            code, discountType, discountValue,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            maxUses: maxUses || null,
            isActive
        }
    });
    
    return { ...coupon, expiryDate: coupon.expiryDate ? coupon.expiryDate.toISOString().split('T')[0] : null };
};

export const deleteCoupon = async (id) => {
    return prisma.coupon.delete({ where: { id } });
};

export const toggleCoupon = async (id) => {
    const existing = await prisma.coupon.findUnique({ where: { id } });
    return prisma.coupon.update({
        where: { id },
        data: { isActive: !existing.isActive }
    });
};
