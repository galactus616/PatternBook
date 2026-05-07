import * as paymentService from "../services/payment.service.js";

export const createOrder = async (req, res) => {
  try {
    const { plan, couponCode } = req.body;
    const result = await paymentService.createOrder(req.user.id, plan, couponCode);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const result = await paymentService.verifyPayment(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
