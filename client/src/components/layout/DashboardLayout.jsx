import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children }) => {
  const mainRef = useRef(null);
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cream flex grain">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main ref={mainRef} className="flex-1 p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>

        {/* Bottom Bar / Footer Mini */}
        <footer className="px-8 py-4 border-t border-rule flex items-center justify-between">
          <p className="font-mono text-[10px] text-muted tracking-wide uppercase">
            © 2026 PatternBook Technologies · System Status: <span className="text-lime-dark">Online</span>
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-mono text-[10px] text-muted hover:text-ink transition-colors uppercase tracking-widest">Docs</a>
            <a href="#" className="font-mono text-[10px] text-muted hover:text-ink transition-colors uppercase tracking-widest">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
