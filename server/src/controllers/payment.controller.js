import * as paymentService from "../services/payment.service.js";

export const createOrder = async (req, res) => {
  try {
    const { planType, couponCode } = req.body;
    const userId = req.user.id;

    const { order, couponApplied } = await paymentService.createOrder(userId, planType, couponCode);
    res.json({ success: true, order, couponApplied });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await paymentService.verifyPayment(userId, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
