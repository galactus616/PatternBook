import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[420px] bg-cream grain border border-rule shadow-2xl rounded-[8px] overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="p-1 hover:bg-faint rounded-full transition-colors cursor-pointer text-muted hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-brand-red mb-3">Welcome back</div>
            <h2 className="font-serif text-[32px] font-black text-ink leading-none">Sign in to <br />Pattern<em className="text-brand-red italic">Book</em></h2>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="alex@example.com"
                className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted">Password</label>
                <button type="button" className="font-mono text-[9px] uppercase tracking-wider text-brand-red hover:underline bg-transparent border-none cursor-pointer">Forgot?</button>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-ink text-cream font-sans text-[13px] font-bold py-4 rounded-[4px] tracking-wide hover:bg-ink-light transition-all duration-200 mt-2 shadow-lg"
            >
              Sign in to dashboard →
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-rule text-center">
            <p className="text-[13px] text-muted">
              New to PatternBook?{" "}
              <button 
                onClick={onSwitchToRegister}
                className="text-ink font-bold hover:text-brand-red transition-colors bg-transparent border-none cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
