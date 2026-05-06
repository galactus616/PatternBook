import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "./useAuth";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const { register, isLoading, error: mutationError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccess(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      resetForm();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSwitch = () => {
    resetForm();
    onSwitchToLogin();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const name = `${firstName} ${lastName}`.trim();
      const res = await register({ name, email, password });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 md:p-6">
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

          {success ? (
            <div className="bg-lime/20 border border-lime/30 p-6 rounded-[4px] text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-[40px]">🎉</div>
              <h3 className="font-serif text-[24px] font-black text-ink">Account Created!</h3>
              <p className="text-[14px] text-muted leading-relaxed">Your account is ready. We're redirecting you to sign in...</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {(error || mutationError) && (
                <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-[12px] p-3 rounded-[4px] font-sans">
                  {error || mutationError?.message || "Registration failed. Please try again."}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Chen"
                    className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Create Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-lime text-lime-dark font-sans text-[14px] font-bold py-4 rounded-[4px] tracking-wide hover:bg-lime-light transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Create your account →"}
                </button>
              </div>

              <p className="text-[10px] text-muted leading-relaxed mt-2">
                By joining, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-rule text-center">
            <p className="text-[13px] text-muted">
              Already have an account?{" "}
              <button
                onClick={handleSwitch}
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
