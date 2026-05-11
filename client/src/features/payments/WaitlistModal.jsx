import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { joinWaitlist } from "./payments.api";
import { usePaymentStore } from "../../store/usePaymentStore";

const TEAM_SIZES = ["2–5 people", "5–10 people", "10–20 people", "20–50 people", "50+ people"];

export default function WaitlistModal() {
  const { showWaitlist, closeWaitlist } = usePaymentStore();

  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (showWaitlist) {
      document.body.style.overflow = "hidden";
      setEmail(""); setTeamSize(""); setMessage(""); setError(""); setSuccess(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showWaitlist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await joinWaitlist({
        email,
        type: "TEAM_PLAN",
        message: `Team size: ${teamSize}${message ? `. Note: ${message}` : ""}`,
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!showWaitlist) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={closeWaitlist} />

      <div className="relative w-full max-w-[440px] bg-cream grain border border-rule shadow-2xl rounded-[8px] overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <button
          onClick={closeWaitlist}
          className="absolute top-4 right-4 z-10 p-1 hover:bg-faint rounded-full transition-colors cursor-pointer text-muted hover:text-ink"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10 overflow-y-auto">
          {success ? (
            <div className="py-10 text-center animate-in fade-in zoom-in duration-500">
              <div className="mb-6 relative inline-block">
                <div className="absolute inset-0 bg-lime blur-2xl opacity-25 rounded-full animate-pulse" />
                <CheckCircle2 size={64} className="text-lime relative z-10" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-[26px] font-black text-ink mb-2">You're on the list!</h3>
              <p className="text-[13px] text-muted leading-relaxed max-w-[280px] mx-auto">
                We'll reach out as soon as Teams goes live. Thanks for your interest!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                  Teams · Coming Soon
                </div>
                <h2 className="font-serif text-[26px] font-black text-ink leading-tight">
                  Join the Team <em className="text-brand-red italic">Waitlist.</em>
                </h2>
                <p className="text-[13px] text-muted leading-relaxed mt-3 italic">
                  We're building collaborative DSA tracking for teams. Be the first to know when it launches.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-[12px] p-3 rounded-[4px]">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
                    Team Size
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    required
                    className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink focus:border-ink focus:bg-white transition-all outline-none cursor-pointer"
                  >
                    <option value="">Select team size...</option>
                    {TEAM_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
                    Message <span className="normal-case">(optional)</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What would you love to see in PatternBook Teams?"
                    rows={3}
                    className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ink text-cream font-sans text-[13px] font-bold py-4 rounded-[4px] tracking-wide hover:bg-ink-light transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Join the Waitlist →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
