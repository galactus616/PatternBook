import { useState, useCallback } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { createOrder, verifyPayment } from "./payments.api";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/**
 * Hook that orchestrates the full Razorpay payment flow.
 * 1. Loads Razorpay SDK
 * 2. Calls create-order on backend
 * 3. Opens Razorpay checkout popup
 * 4. On Razorpay success → calls verify-payment on backend
 * 5. On verification success → calls onSuccess callback
 */
export const useRazorpay = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = useCallback(
    async ({ planType, couponCode, onSuccess, onError }) => {
      setIsLoading(true);

      try {
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
          throw new Error("Razorpay SDK failed to load. Check your internet connection.");
        }

        // Create order on backend (includes coupon discount)
        const { order } = await createOrder({ planType, couponCode });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "PatternBook",
          description: `Pro Plan — 1 Year Access`,
          order_id: order.id,
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#b8ff57",
          },
          modal: {
            ondismiss: () => setIsLoading(false),
          },
          handler: async (response) => {
            try {
              const result = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (result.success) {
                onSuccess?.(result);
              } else {
                onError?.("Payment verification failed. Please contact support.");
              }
            } catch (err) {
              onError?.(err?.response?.data?.message || err.message || "Verification failed.");
            } finally {
              setIsLoading(false);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        onError?.(err?.response?.data?.message || err.message || "Something went wrong.");
        setIsLoading(false);
      }
    },
    [user]
  );

  return { initiatePayment, isLoading };
};
