import React from "react";
import { CreditCard, Zap, ExternalLink, Crown, Check, X as XIcon } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { usePaymentStore } from "../../store/usePaymentStore";
import { usePaymentHistory } from "./useSettings";

const PLAN_META = {
  FREE: { label: "Free Plan", color: "text-muted", bg: "bg-faint", border: "border-rule" },
  PRO:  { label: "Pro Member", color: "text-cream", bg: "bg-ink", border: "border-ink" },
  TEAM: { label: "Team Member", color: "text-cream", bg: "bg-ink", border: "border-ink" },
};

const FEATURE_COMPARE = [
  { name: "Pattern Tracks", free: "3 fundamental", pro: "18+ all patterns" },
  { name: "Curated Problems", free: "50+", pro: "500+" },
  { name: "Progress Tracker", free: true, pro: true },
  { name: "Problem Hints", free: false, pro: true },
  { name: "Personal Notes", free: false, pro: true },
  { name: "LeetCode Links", free: false, pro: true },
  { name: "Mastery Analytics", free: "Basic", pro: "Detailed" },
  { name: "Priority Support", free: false, pro: true },
];

const formatINR = (paise) => `₹${(paise / 100).toLocaleString("en-IN")}`;

const SubscriptionSection = () => {
  const { user } = useAuth();
  const { openCheckout } = usePaymentStore();
  const { data: history, isLoading: historyLoading } = usePaymentHistory();

  const plan = user?.plan || "FREE";
  const meta = PLAN_META[plan];
  const isPro = plan === "PRO" || plan === "TEAM";

  return (
    <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-rule bg-faint/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard size={16} className="text-ink" />
          <h3 className="font-serif text-[18px] font-black text-ink">Subscription</h3>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Plan & Billing</p>
      </div>

      <div className="p-6 space-y-7">
        {/* ── Current Plan ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isPro ? (
              <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center border-2 border-ink/20">
                <Crown size={20} className="text-cream" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-faint flex items-center justify-center border border-rule">
                <Zap size={20} className="text-muted" />
              </div>
            )}
            <div>
              <p className="font-serif text-[20px] font-black text-ink leading-tight">{meta.label}</p>
              {isPro && user?.subscriptionEndsAt && (
                <p className="font-mono text-[10px] text-muted mt-1">
                  Active until {new Date(user.subscriptionEndsAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              )}
              {!isPro && (
                <p className="font-mono text-[10px] text-muted mt-1">
                  3 fundamental tracks · 50+ problems
                </p>
              )}
            </div>
          </div>
          <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-[2px] border ${meta.bg} ${meta.color} ${meta.border}`}>
            {plan}
          </span>
        </div>

        {/* ── Upgrade CTA for FREE ── */}
        {!isPro && (
          <div className="bg-ink rounded-[6px] p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Crown size={16} className="text-cream" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-cream/50">Pro Plan</span>
              </div>
              <h4 className="font-serif text-[24px] font-black text-cream leading-tight mb-1">
                Unlock the full <em className="text-brand-red italic">pattern system.</em>
              </h4>
              <p className="font-sans text-[12px] text-cream/50 leading-relaxed mb-5 max-w-[380px]">
                Access every pattern track, detailed hints, personal notes, and full mastery analytics.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => openCheckout("PRO")}
                  className="bg-lime text-lime-dark font-sans text-[13px] font-bold py-3 px-6 rounded-[4px] tracking-wide hover:bg-lime-light transition-all cursor-pointer flex items-center gap-2 shadow-[0_4px_20px_rgba(184,255,87,0.2)]"
                >
                  <Zap size={14} className="fill-lime-dark" /> Upgrade to Pro →
                </button>
                <span className="font-mono text-[10px] text-cream/30 uppercase tracking-wider">₹499 / year</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Pro: Manage Billing ── */}
        {isPro && (
          <div className="flex items-center justify-between bg-cream-dark/50 border border-rule/50 p-4 rounded-[4px]">
            <div>
              <p className="font-sans text-[13px] font-bold text-ink">Manage Subscription</p>
              <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">Auto-renews · cancel anytime</p>
            </div>
            <button className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink hover:text-brand-red transition-colors cursor-pointer bg-transparent border border-rule px-3 py-1.5 rounded-[4px] hover:border-brand-red">
              <ExternalLink size={12} /> Billing Portal
            </button>
          </div>
        )}

        <div className="h-px bg-rule/50" />

        {/* ── Feature Comparison ── */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Plan Comparison</p>
          <div className="border border-rule rounded-[4px] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-faint/50 border-b border-rule">
                  <th className="font-mono text-[9px] uppercase tracking-widest text-muted px-4 py-2.5">Feature</th>
                  <th className="font-mono text-[9px] uppercase tracking-widest text-muted px-4 py-2.5 text-center">Free</th>
                  <th className="font-mono text-[9px] uppercase tracking-widest text-cream px-4 py-2.5 text-center bg-ink">Pro</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARE.map((feat, i) => (
                  <tr key={feat.name} className={`border-b border-rule/30 ${i % 2 === 0 ? 'bg-white' : 'bg-cream-dark/20'}`}>
                    <td className="font-sans text-[12px] font-semibold text-ink px-4 py-2.5">{feat.name}</td>
                    <td className="px-4 py-2.5 text-center">
                      {feat.free === true ? (
                        <Check size={14} className="text-lime-dark mx-auto" />
                      ) : feat.free === false ? (
                        <XIcon size={14} className="text-faint mx-auto" />
                      ) : (
                        <span className="font-mono text-[11px] text-muted">{feat.free}</span>
                      )}
                    </td>
                    <td className={`px-4 py-2.5 text-center ${isPro ? 'bg-ink' : 'bg-ink'}`}>
                      {feat.pro === true ? (
                        <Check size={14} className="text-lime mx-auto" />
                      ) : feat.pro === false ? (
                        <XIcon size={14} className="text-cream/20 mx-auto" />
                      ) : (
                        <span className="font-mono text-[11px] text-cream/70">{feat.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="h-px bg-rule/50" />

        {/* ── Payment History ── */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Payment History</p>
          {historyLoading ? (
            <div className="space-y-2">
              {[1, 2].map(i => (
                <div key={i} className="h-14 bg-faint/30 animate-pulse rounded-[2px]" />
              ))}
            </div>
          ) : history?.data?.length > 0 ? (
            <div className="border border-rule rounded-[4px] overflow-hidden">
              {history.data.map((tx, i) => (
                <div key={tx.id} className={`flex items-center justify-between px-4 py-3 hover:bg-cream-dark/30 transition-colors ${i < history.data.length - 1 ? 'border-b border-rule/30' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center shrink-0">
                      <CreditCard size={14} className="text-cream" />
                    </div>
                    <div>
                      <p className="font-sans text-[13px] font-bold text-ink">Pro Plan — Annual</p>
                      <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-serif text-[16px] font-black text-ink">{formatINR(tx.amount)}</p>
                      <span className={`font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-[2px] ${
                        tx.status === "captured" ? "bg-ink text-cream" : "bg-faint text-muted"
                      }`}>
                        {tx.status === "captured" ? "Paid" : tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center border border-dashed border-rule/50 rounded-[4px]">
              <CreditCard size={24} className="text-faint mx-auto mb-2" />
              <p className="font-serif text-[14px] text-muted italic">No transactions yet.</p>
              <p className="font-mono text-[9px] text-faint uppercase tracking-wider mt-1">Upgrade to Pro to see payment history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;