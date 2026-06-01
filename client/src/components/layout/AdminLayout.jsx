import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children }) => {
  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) mainRef.current.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="h-screen bg-cream flex grain overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main ref={mainRef} className="flex-1 overflow-y-scroll scroll-smooth">
          <AdminContent>{children}</AdminContent>
        </main>

        {/* Footer — matches user dashboard */}
        <footer className="px-8 py-4 border-t border-rule flex items-center justify-between">
          <p className="font-mono text-[10px] text-muted tracking-wide uppercase">
            © 2026 PatternBook Technologies · Admin Console ·{' '}
            <span className="text-lime-dark">Online</span>
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

const AdminContent = ({ children }) => {
  const { loading } = useAdmin();
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-rule border-t-ink rounded-full animate-spin" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted animate-pulse">Loading Admin Data...</p>
        </div>
      </div>
    );
  }
  return children;
};

export default AdminLayout;
