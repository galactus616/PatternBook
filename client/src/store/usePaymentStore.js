import { create } from "zustand";

export const usePaymentStore = create((set) => ({
  showCheckout: false,
  showWaitlist: false,
  pendingPlan: "PRO",

  openCheckout: (plan = "PRO") => set({ showCheckout: true, pendingPlan: plan }),
  closeCheckout: () => set({ showCheckout: false }),

  openWaitlist: () => set({ showWaitlist: true }),
  closeWaitlist: () => set({ showWaitlist: false }),
}));
