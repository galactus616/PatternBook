import { create } from "zustand";

/**
 * Global UI store for payment modals.
 * Lets any component (Sidebar, UpgradeBanner, Problems page) trigger
 * the checkout flow without prop drilling.
 */
export const usePaymentStore = create((set) => ({
  showCheckout: false,
  showWaitlist: false,
  pendingPlan: "PRO",

  openCheckout: (plan = "PRO") => set({ showCheckout: true, pendingPlan: plan }),
  closeCheckout: () => set({ showCheckout: false }),

  openWaitlist: () => set({ showWaitlist: true }),
  closeWaitlist: () => set({ showWaitlist: false }),
}));
