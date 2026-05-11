import axios from "../../lib/axios";

// Validate coupon preview — no order created, just returns discount info
export const validateCoupon = async ({ couponCode, planType }) => {
  const res = await axios.post("/payments/validate-coupon", { couponCode, planType });
  return res.data;
};

// Create a Razorpay order (called just before opening checkout popup)
export const createOrder = async ({ planType, couponCode }) => {
  const res = await axios.post("/payments/create-order", { planType, couponCode });
  return res.data;
};

// Verify payment signature after Razorpay success callback
export const verifyPayment = async (paymentData) => {
  const res = await axios.post("/payments/verify-payment", paymentData);
  return res.data;
};

// Join the Team plan waitlist
export const joinWaitlist = async ({ email, type, message }) => {
  const res = await axios.post("/waitlist/join", { email, type, message });
  return res.data;
};
