import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, Tag, AlertCircle, ShieldCheck, Zap } from "lucide-react";
import { validateCoupon } from "./payments.api";
import { useRazorpay } from "./useRazorpay";
import { useAuthStore } from "../../store/useAuthStore";
import { usePaymentStore } from "../../store/usePaymentStore";

const PRO_FEATURES = [
  { icon: "🔓", text: "All Pro problem hints unlocked" },
  { icon: "🔗", text: "Direct LeetCode links for every problem" },
  { icon: "📝", text: "Personal notes on any problem" },
  { icon: "📊", text: "Full mastery analytics & breakdown" },
  { icon: "⚡", text: "Early access to new patterns & features" },
];

const PLAN_PRICES = { PRO: 49900 };

const formatINR = (paise) => `₹${(paise / 100).toLocaleString("en-IN")}`;

export default function CheckoutModal({ onPaymentSuccess }) {
  const { showCheckout, pendingPlan, closeCheckout } = usePaymentStore();
  const { setPlan } = useAuthStore();
  const { initiatePayment, isLoading: payLoading } = useRazorpay();

  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponJustApplied, setCouponJustApplied] = useState(false);
  const [payError, setPayError] = useState("");
  const [success, setSuccess] = useState(false);

  const originalAmount = PLAN_PRICES[pendingPlan] || 49900;
  const finalAmount = couponData ? couponData.discountedAmount : originalAmount;
  const isProcessing = couponLoading || couponJustApplied;

  useEffect(() => {
    if (showCheckout) {
      document.body.style.overflow = "hidden";
      setCouponInput(""); setCouponCode(""); setCouponData(null);
      setCouponError(""); setPayError(""); setSuccess(false); setCouponJustApplied(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showCheckout]);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true); setCouponError(""); setCouponData(null);
    try {
      const res = await validateCoupon({ couponCode: code, planType: pendingPlan });
      if (res.success) {
        setCouponData(res.data);
        setCouponCode(code);
        setCouponJustApplied(true);
        setTimeout(() => setCouponJustApplied(false), 2000);
      }
    } catch (err) {
      setCouponError(err?.response?.data?.message || "Invalid or expired coupon code.");
      setCouponCode("");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponData(null); setCouponCode(""); setCouponInput(""); setCouponError(""); setCouponJustApplied(false);
  };

  const handlePay = () => {
    setPayError("");
    initiatePayment({
      planType: pendingPlan,
      couponCode: couponCode || undefined,
      onSuccess: () => {
        setPlan("PRO");
        setSuccess(true);
        setTimeout(() => { closeCheckout(); onPaymentSuccess?.(); }, 2500);
      },
      onError: (msg) => setPayError(msg),
    });
  };

  if (!showCheckout) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-md"
        onClick={!payLoading && !success ? closeCheckout : undefined}
      />

      {/* Modal — two column layout */}
      <div className="relative w-full max-w-[780px] flex rounded-[10px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[92vh]">

        {/* ── LEFT PANEL — dark, benefits ── */}
        <div className="hidden md:flex flex-col w-[46%] bg-ink p-10 relative overflow-hidden shrink-0">
          {/* Subtle dot-grid background */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-lime/10 border border-lime/20 text-lime font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full w-fit mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              Pro Plan · Yearly
            </div>

            <h2 className="font-serif text-[28px] font-black text-cream leading-tight mb-1">
              Unlock the full<br />
              <em className="text-brand-red italic">pattern system.</em>
            </h2>
            <p className="font-sans text-[12px] text-cream/40 leading-relaxed mb-8">
              Everything you need to go from grinding to structured mastery.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-4 flex-1">
              {PRO_FEATURES.map((f) => (
                <div key={f.text} className="flex items-start gap-3">
                  <span className="text-[16px] leading-none mt-0.5">{f.icon}</span>
                  <span className="font-sans text-[13px] text-cream/70 leading-snug">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-8 pt-6 border-t border-cream/10">
              <p className="font-mono text-[9px] uppercase tracking-widest text-cream/25 mb-2">Trusted by</p>
              <p className="font-serif text-[18px] font-black text-cream/40">
                500<em className="text-lime not-italic font-black">+</em> developers
              </p>
              <p className="font-sans text-[11px] text-cream/25 mt-0.5">already on the Pro plan</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — light, checkout form ── */}
        <div className="flex-1 bg-cream grain flex flex-col overflow-y-auto">
          {/* Close button */}
          {!payLoading && (
            <button
              onClick={closeCheckout}
              className="absolute top-4 right-4 z-20 p-1.5 hover:bg-faint rounded-full transition-colors cursor-pointer text-muted hover:text-ink"
            >
              <X size={18} />
            </button>
          )}

          <div className="p-8 md:p-10 flex flex-col h-full">

            {/* ── SUCCESS STATE ── */}
            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-6 relative inline-block">
                  <div className="absolute inset-0 bg-lime blur-2xl opacity-30 rounded-full animate-pulse" />
                  <CheckCircle2 size={64} className="text-lime relative z-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-[26px] font-black text-ink mb-2 leading-tight">
                  Welcome to <em className="text-brand-red italic">Pro!</em>
                </h3>
                <p className="text-[13px] text-muted leading-relaxed max-w-[220px]">
                  Your account is upgraded. All patterns are now unlocked.
                </p>
                <div className="mt-6 max-w-[160px] w-full mx-auto">
                  <div className="h-0.5 w-full bg-rule/20 rounded-full overflow-hidden">
                    <div className="h-full bg-lime animate-[progress_2.5s_ease-in-out_forwards]" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">
                    Checkout · 1 Year Access
                  </div>
                  <h3 className="font-serif text-[22px] font-black text-ink leading-tight">
                    Complete your upgrade
                  </h3>
                </div>

                {/* ── COUPON SECTION ── */}
                <div className="mb-5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
                    Coupon Code
                  </label>

                  {couponData ? (
                    <div className="flex items-center gap-3 bg-lime/10 border border-lime/40 px-4 py-3 rounded-[4px] animate-in fade-in duration-300">
                      <Tag size={13} className="text-lime-dark shrink-0" />
                      <span className="font-mono text-[11px] text-lime-dark font-bold flex-1">
                        {couponData.code} — Save {formatINR(couponData.savings)}!
                      </span>
                      <button onClick={handleRemoveCoupon} className="text-muted hover:text-brand-red transition-colors cursor-pointer">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        placeholder="Enter code..."
                        className="flex-1 bg-white/50 border border-rule px-4 py-2.5 rounded-[4px] font-mono text-[12px] text-ink placeholder:text-faint focus:border-ink focus:bg-white transition-all outline-none tracking-widest uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2.5 bg-ink text-cream font-sans text-[11px] font-bold rounded-[4px] tracking-wide hover:bg-ink-light transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                      >
                        {couponLoading ? <Loader2 size={13} className="animate-spin" /> : <><Tag size={12}/> Apply</>}
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <div className="flex items-center gap-1.5 mt-2 text-brand-red text-[11px] font-mono">
                      <AlertCircle size={11} /> {couponError}
                    </div>
                  )}
                </div>

                {/* ── ORDER SUMMARY ── */}
                <div className={`border rounded-[6px] p-5 mb-5 transition-all duration-300 ${
                  couponJustApplied ? "bg-lime/5 border-lime/30" : "bg-cream-dark border-rule"
                }`}>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted font-mono uppercase tracking-wide">Plan</span>
                      <span className="font-sans font-bold text-ink">Pro — 1 Year</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted font-mono uppercase tracking-wide">Price</span>
                      <span className={`font-sans font-bold transition-all duration-300 ${couponData ? "line-through text-muted" : "text-ink"}`}>
                        {formatINR(originalAmount)}
                      </span>
                    </div>

                    {/* Discount row — slides in */}
                    <div className={`flex justify-between text-[11px] overflow-hidden transition-all duration-500 ease-out ${
                      couponData ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <span className="text-lime-dark font-mono uppercase tracking-wide">Discount</span>
                      <span className="font-sans font-bold text-lime-dark">
                        − {couponData ? formatINR(couponData.savings) : ""}
                      </span>
                    </div>

                    <div className="h-px bg-rule" />

                    {/* Total */}
                    <div className="flex justify-between items-center pt-0.5">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-ink font-bold">Total Due</span>
                      {couponJustApplied ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-14 bg-rule rounded animate-pulse" />
                          <span className="font-mono text-[9px] text-muted uppercase">Recalculating</span>
                        </div>
                      ) : (
                        <span key={finalAmount} className="font-serif text-[24px] font-black text-ink leading-none animate-in fade-in duration-500">
                          {formatINR(finalAmount)}
                          <span className="font-sans text-[11px] text-muted font-normal">/yr</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pay error */}
                {payError && (
                  <div className="flex items-start gap-2 mb-4 bg-brand-red/10 border border-brand-red/20 text-brand-red text-[11px] p-3 rounded-[4px]">
                    <AlertCircle size={13} className="shrink-0 mt-0.5" /> {payError}
                  </div>
                )}

                {/* ── PAY BUTTON ── */}
                <button
                  onClick={handlePay}
                  disabled={payLoading || isProcessing}
                  className="w-full bg-lime text-lime-dark font-sans text-[14px] font-bold py-4 rounded-[4px] tracking-wide hover:bg-lime-light active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_6px_32px_rgba(184,255,87,0.25)]"
                >
                  {payLoading ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : couponJustApplied ? (
                    <><Loader2 size={16} className="animate-spin" /> Updating price...</>
                  ) : (
                    <>
                      <Zap size={16} className="fill-lime-dark" />
                      Pay {formatINR(finalAmount)} securely →
                    </>
                  )}
                </button>

                {/* Trust line */}
                <div className="mt-4 flex items-center justify-center gap-3">
                  <ShieldCheck size={13} className="text-muted" />
                  <span className="font-mono text-[9px] text-muted uppercase tracking-widest">
                    Secured by Razorpay · 1-year access · Cancel anytime
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
