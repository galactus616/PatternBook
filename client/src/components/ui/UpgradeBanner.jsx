import React, { useState } from "react";
import { X, Zap } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { usePaymentStore } from "../../store/usePaymentStore";

export default function UpgradeBanner() {
  const { user } = useAuthStore();
  const { openCheckout } = usePaymentStore();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem("upgradeBannerDismissed") === "true"
  );

  // Only show for FREE users
  if (user?.plan !== "FREE" && user?.plan !== undefined) return null;
  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("upgradeBannerDismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-ink text-cream px-6 py-3 border-b border-cream/10">
      <div className="flex items-center gap-3 min-w-0">
        <Zap size={14} className="text-lime fill-lime shrink-0" />
        <p className="font-mono text-[10px] uppercase tracking-wide truncate">
          You're on the <span className="text-muted">Free</span> plan ·{" "}
          <span className="text-cream/60">12+ advanced patterns are locked</span>
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => openCheckout("PRO")}
          className="bg-lime text-lime-dark font-sans text-[11px] font-bold px-4 py-1.5 rounded-[3px] tracking-wide hover:bg-lime-light transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          Upgrade to Pro →
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-cream/30 hover:text-cream transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
