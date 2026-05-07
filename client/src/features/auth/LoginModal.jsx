import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "./useAuth";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const navigate = useNavigate();
  const { login, googleLogin, isLoading, error: mutationError, resetErrors } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      await googleLogin(tokenResponse.access_token);
      onClose();
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Login Error:", err);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google login failed. Please try again."),
  });

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    resetErrors?.();
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
    onSwitchToRegister();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password });
      if (res.success) {
        onClose();
        navigate("/dashboard");
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
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
      <div className="relative w-full max-w-[420px] bg-cream grain border border-rule shadow-2xl rounded-[8px] overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-1 hover:bg-faint rounded-full transition-colors cursor-pointer text-muted hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 md:p-10 overflow-y-auto">
          <div className="mb-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-brand-red mb-3">Welcome back</div>
            <h2 className="font-serif text-[32px] font-black text-ink leading-none">Sign in to <br />Pattern<em className="text-brand-red italic">Book</em></h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {(error || mutationError) && (
              <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-[12px] p-3 rounded-[4px] font-sans">
                {error || mutationError?.message || "Invalid credentials. Please try again."}
              </div>
            )}

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
              <div className="flex justify-between items-center mb-2">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted">Password</label>
                <button type="button" className="font-mono text-[9px] uppercase tracking-wider text-brand-red hover:underline bg-transparent border-none cursor-pointer">Forgot?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/50 border border-rule px-4 py-3 pr-12 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ink text-cream font-sans text-[13px] font-bold py-4 rounded-[4px] tracking-wide hover:bg-ink-light transition-all duration-200 mt-2 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign in to dashboard →"}
            </button>
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-rule/50"></div>
              </div>
              <span className="relative px-4 bg-cream text-[10px] font-mono uppercase tracking-[0.2em] text-muted">Or continue with</span>
            </div>

            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="w-full bg-white border border-rule/80 text-ink font-sans text-[13px] font-bold py-4 rounded-[4px] tracking-wide hover:bg-faint transition-all duration-200 shadow-sm flex items-center justify-center gap-3 cursor-pointer group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-rule text-center">
            <p className="text-[13px] text-muted">
              New to PatternBook?{" "}
              <button
                onClick={handleSwitch}
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
