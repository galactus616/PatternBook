import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
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
      <div className="relative w-full max-w-[460px] bg-cream grain border border-rule shadow-2xl rounded-[8px] overflow-hidden animate-in fade-in zoom-in duration-300">
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
            <div className="font-mono text-[10px] uppercase tracking-widest text-lime-dark bg-lime px-2 py-0.5 inline-block rounded-full mb-3">Get Started</div>
            <h2 className="font-serif text-[32px] font-black text-ink leading-tight">Master DSA with <br />a <em className="text-brand-red italic">structure.</em></h2>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">First Name</label>
                <input 
                  type="text" 
                  placeholder="Alex"
                  className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Chen"
                  className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="alex@example.com"
                className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Create Password</label>
              <input 
                type="password" 
                placeholder="Minimum 8 characters"
                className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full bg-lime text-lime-dark font-sans text-[14px] font-bold py-4 rounded-[4px] tracking-wide hover:bg-lime-light transition-all duration-200 shadow-lg"
              >
                Create your account →
              </button>
            </div>
            
            <p className="text-[10px] text-muted leading-relaxed mt-2">
              By joining, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </form>

          <div className="mt-8 pt-8 border-t border-rule text-center">
            <p className="text-[13px] text-muted">
              Already have an account?{" "}
              <button 
                onClick={onSwitchToLogin}
                className="text-ink font-bold hover:text-brand-red transition-colors bg-transparent border-none cursor-pointer"
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
