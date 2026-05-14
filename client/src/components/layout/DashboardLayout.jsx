import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import UpgradeBanner from "../ui/UpgradeBanner";
import CheckoutModal from "../../features/payments/CheckoutModal";
import WaitlistModal from "../../features/payments/WaitlistModal";
import { usePaymentStore } from "../../store/usePaymentStore";
import { useAuthStore } from "../../store/useAuthStore";

const DashboardLayout = ({ children }) => {
  const mainRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { openCheckout } = usePaymentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) mainRef.current.scrollTo(0, 0);
  }, [location.pathname]);

  // Intent persistence: if user registered/logged in after clicking "Get Pro" on landing page
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingUpgrade");
    if (pending) {
      sessionStorage.removeItem("pendingUpgrade");
      
      // ONLY open checkout if user is currently FREE
      if (user?.plan === "FREE") {
        setTimeout(() => openCheckout(pending), 400);
      }
    }
  }, [user?.plan, openCheckout]);

  const handlePaymentSuccess = () => {
    // After payment: banner auto-hides (user.plan is now "PRO")
    // Navigate to dashboard root to show fresh state
    navigate("/dashboard");
  };

  return (
    <div className="h-screen bg-cream flex grain overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Upgrade banner (only shown for FREE plan users) */}
        <UpgradeBanner />

        <Header />

        <main ref={mainRef} className="flex-1 overflow-y-scroll scroll-smooth">
          {children}
        </main>

        <footer className="px-8 py-4 border-t border-rule flex items-center justify-between">
          <p className="font-mono text-[10px] text-muted tracking-wide uppercase">
            © 2026 PatternBook Technologies · System Status:{" "}
            <span className="text-lime-dark">Online</span>
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-mono text-[10px] text-muted hover:text-ink transition-colors uppercase tracking-widest">Docs</a>
            <a href="#" className="font-mono text-[10px] text-muted hover:text-ink transition-colors uppercase tracking-widest">Support</a>
          </div>
        </footer>
      </div>

      {/* Global payment modals — mounted once at layout level */}
      <CheckoutModal onPaymentSuccess={handlePaymentSuccess} />
      <WaitlistModal />
    </div>
  );
};

export default DashboardLayout;
