import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../features/auth/useAuth";
import LoginModal from "../features/auth/LoginModal";
import RegisterModal from "../features/auth/RegisterModal";

/* ─── Hook ─── */
function useReveal() {
  const [ref, setRef] = React.useState(null);
  React.useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        obs.unobserve(e.target);
      }
    }, { threshold: 0.15 });
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);
  return setRef;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  "Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search",
  "Linked Lists", "Trees", "Tries", "Heap / Priority Queue", "Graphs",
  "Dynamic Programming", "Backtracking", "Greedy", "Intervals", "Bit Manipulation",
];

const STEPS = [
  { n: "01", icon: "🗂", title: "Pick a Pattern", desc: "Browse our curated pattern library — from Two Pointers to Segment Trees. Each pattern has a dedicated track with progressive problems." },
  { n: "02", icon: "🧠", title: "Understand Deeply", desc: "Every pattern comes with an illustrated breakdown, time complexity analysis, and the exact mental model to apply it in any variant." },
  { n: "03", icon: "📈", title: "Track Mastery", desc: "Your mastery score updates in real-time. See exactly which patterns need more reps — no more wondering if you're actually ready." },
];

const FEATURES = [
  { id: "F–01", title: "Visual Roadmaps", desc: "A phase-gated curriculum that sequences patterns in the exact order they build on each other. Master the foundation first." },
  { id: "F–02", title: "Pattern Engine", desc: "Our proprietary algorithm surfaces problems right before you forget them. Build long-term retention through SRS reps." },
  { id: "F–03", title: "Handwritten Notes", desc: "Annotate any pattern with tags, insights, and approach diagrams. Build a personal DSA knowledge base that lasts." },
  { id: "F–04", title: "Focus Sessions", desc: "Timed deep-dives into specific pattern variants. Simulates real interview pressure with detailed post-session analytics." },
];

const METRICS = [
  { val: "3.2×", label: "faster pattern recognition after 21 days vs. unstructured LeetCode grinding" },
  { val: "92%", label: "of PatternBook beta users report feeling significantly more prepared for technical rounds" },
  { val: "500+", label: "early-access developers currently building their roadmap on PatternBook" },
];

const FREE_FEATURES = ["3 Fundamental Pattern Tracks", "50+ Curated Problems", "Basic Progress Visualizer", "Public Pattern Index"];
const PRO_FEATURES = ["All 18+ Advanced Patterns", "500+ Progressive Problems", "Personalized SRS Engine", "Handwritten Pattern Notes", "Mock Interview Focus Mode", "Detailed Mastery Analytics"];
const TEAM_FEATURES = ["Everything in Pro", "Team Progress Dashboard", "Collaborative Study Groups", "Custom Pattern Curations", "Priority Support"];

/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const howRef = useReveal();
  const featRef = useReveal();
  const testiRef = useReveal();
  const pricingRef = useReveal();
  const ctaRef = useReveal();

  const marqueeItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const handleStart = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setShowRegister(true);
    }
  };

  return (
    <div className="min-h-screen relative grain font-sans bg-cream text-ink overflow-x-hidden selection:bg-lime selection:text-lime-dark">

      {/* ── MODALS ── */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-100 grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 h-[58px] bg-cream/88 backdrop-blur-lg border-b border-rule">
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Method", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Blog", href: "#" }
          ].map(l => (
            <a key={l.label} href={l.href} className="text-[12px] text-muted no-underline tracking-wide font-medium hover:text-ink transition-color duration-200" onClick={(e) => {
              if (l.href.startsWith("#") && l.href !== "#") {
                e.preventDefault();
                document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth" });
              }
            }}>{l.label}</a>
          ))}
        </div>
        <div className="font-serif text-[20px] font-black tracking-tight cursor-pointer flex items-center gap-1.5" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span>Pattern<em className="text-brand-red italic">Book</em></span>
          <span className="font-mono text-[7px] border border-brand-red/30 text-brand-red px-1 py-0.5 rounded-[2px] tracking-widest uppercase leading-none -translate-y-1.5 opacity-80">Beta</span>
        </div>
        <div className="flex items-center gap-3 justify-end">
          {isAuthenticated ? (
            <>
              <button className="hidden md:block bg-transparent border border-rule cursor-pointer text-[12px] text-muted font-sans py-1.5 px-4.5 rounded-[4px] tracking-wide hover:border-ink hover:text-ink transition-all duration-200" onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button className="bg-ink text-cream border-none cursor-pointer text-[12px] font-bold py-1.5 px-5 rounded-[4px] tracking-wide hover:bg-ink-light transition-all duration-200" onClick={logout}>Sign out</button>
            </>
          ) : (
            <>
              <button className="hidden md:block bg-transparent border border-rule cursor-pointer text-[12px] text-muted font-sans py-1.5 px-4.5 rounded-[4px] tracking-wide hover:border-ink hover:text-ink transition-all duration-200" onClick={() => setShowLogin(true)}>Sign in</button>
              <button className="bg-ink text-cream border-none cursor-pointer text-[12px] font-bold py-1.5 px-5 rounded-[4px] tracking-wide hover:bg-ink-light transition-all duration-200" onClick={() => setShowRegister(true)}>Get started →</button>
            </>
          )}
          <button className="md:hidden bg-transparent border-none cursor-pointer p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className={`md:hidden fixed top-[58px] left-0 right-0 z99 bg-cream border-b border-rule px-8 py-6 flex-col gap-[18px] transition-all duration-300 ${menuOpen ? "flex" : "hidden"}`}>
        {[
          { label: "Method", href: "#how-it-works" },
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Blog", href: "#" }
        ].map(l => (
          <a key={l.label} href={l.href} className="text-[14px] text-muted no-underline" onClick={(e) => {
            setMenuOpen(false);
            if (l.href.startsWith("#") && l.href !== "#") {
              e.preventDefault();
              document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth" });
            }
          }}>{l.label}</a>
        ))}
        {isAuthenticated ? (
          <button className="w-full bg-lime text-lime-dark border-none font-sans text-[13px] font-semibold py-3.5 px-8 rounded-[4px] tracking-wide mt-2 hover:bg-lime-light transition-all duration-200" onClick={() => navigate("/dashboard")}>Go to Dashboard →</button>
        ) : (
          <button className="w-full bg-lime text-lime-dark border-none font-sans text-[13px] font-semibold py-3.5 px-8 rounded-[4px] tracking-wide mt-2 hover:bg-lime-light transition-all duration-200" onClick={() => setShowRegister(true)}>Get started →</button>
        )}
      </div>

      {/* ── HERO ── */}
      <section className="pt-[58px] grid grid-cols-1 md:grid-cols-3 min-h-screen border-b border-rule">
        <div className="p-10 md:p-14 md:col-span-2 md:pr-14 md:border-r border-rule flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] opacity-[0.03] pointer-events-none rotate-12">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-muted mb-10">
              <span className="text-brand-red mr-1">01 /</span> DSA mastery platform
            </div>
            <h1 className="font-serif text-[clamp(60px,7vw,96px)] font-black leading-[0.9] tracking-tight text-ink max-w-[800px]">
              Stop <em className="italic text-brand-red">grinding.</em> Start thinking.
            </h1>
          </div>
          <div className="mt-20">
            <p className="font-prose text-[20px] leading-[1.6] text-muted max-w-[600px] mb-10 italic">
              Most developers fail interviews not because they don't work hard — but because they work without structure. PatternBook fixes that.
            </p>
            <div className="flex gap-3 items-center flex-wrap">
              <button className="cursor-pointer bg-lime text-lime-dark border-none font-sans text-[13px] font-semibold py-3.5 px-8 rounded-[4px] tracking-wide hover:bg-lime-light hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(184,255,87,0.25)] transition-all duration-200" onClick={handleStart}>
                {isAuthenticated ? "Go to Dashboard →" : "Begin for free →"}
              </button>
              <button className="group cursor-pointer bg-transparent border-none font-sans text-[13px] text-muted tracking-wide flex items-center gap-1.5 hover:text-ink transition-colors duration-200" onClick={() => document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })}>
                See how it works <span className="text-[16px] inline-block transition-transform duration-200 group-hover:translate-x-1 group-hover:translate-y-1">↓</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col">
          <div className="grid grid-cols-2 border-b border-rule shrink-0">
            <div className="p-7 md:p-8 border-r border-rule">
              <div className="font-serif text-[42px] font-black tracking-tight text-ink leading-none">12<em className="text-brand-red not-italic font-black">k+</em></div>
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted mt-1.5">Problems catalogued</div>
            </div>
            <div className="p-7 md:p-8">
              <div className="font-serif text-[42px] font-black tracking-tight text-ink leading-none">94<em className="text-brand-red not-italic font-black">%</em></div>
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted mt-1.5">Interview success rate</div>
            </div>
          </div>
          <div className="flex-1 p-8 font-mono text-[12px] leading-[1.8] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-lime to-transparent" />
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] text-muted tracking-wide">two_sum.py · pattern: hash-map</span>
              <span className="flex items-center gap-1.5 text-[10px] text-lime-dark bg-lime/20 py-0.5 px-2.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-light animate-blink" /> Solved
              </span>
            </div>
            {[
              [1, <><span className="text-muted italic"># Pattern: Two-pass hash map — O(n)</span></>],
              [2, <><span className="text-[#b34a00]">def</span> <span className="text-ink-light font-medium">two_sum</span>(nums, target):</>],
              [3, <>{"    "}seen <span className="text-muted">=</span> {"{}"}</>],
              [4, <>{"    "}<span className="text-[#b34a00]">for</span> i, n <span className="text-[#b34a00]">in</span> <span className="text-ink-light font-medium">enumerate</span>(nums):</>],
              [5, <>{"        "}diff <span className="text-muted">=</span> target <span className="text-muted">-</span> n</>],
              [6, <>{"        "}<span className="text-[#b34a00]">if</span> diff <span className="text-[#b34a00]">in</span> seen:</>],
              [7, <>{"            "}<span className="text-[#b34a00]">return</span> [seen[diff], i]</>],
              [8, <>{"        "}seen[n] <span className="text-muted">=</span> i</>],
              [9, <>&nbsp;</>],
              [10, <><span className="text-muted italic"># Next: Sliding Window pattern →</span></>],
              [11, <><span className="text-muted italic"># max_subarray, longest_substring...</span></>],
              [12, <>&nbsp;</>],
              [13, <><span className="text-muted italic"># Completed 4/8 Hash Map problems</span></>],
              [14, <><span className="text-muted italic"># Mastery: ████████░░ 78%</span></>],
            ].map(([n, code]) => (
              <div key={n} className="flex gap-4 py-0.25">
                <span className="text-faint select-none min-w-[20px] text-right text-[10px] mt-0.5">{n}</span>
                <span className="whitespace-pre">{code}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-t border-b border-rule overflow-hidden py-3.5 bg-ink">
        <div className="flex whitespace-nowrap animate-marquee">
          {marqueeItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-9 font-mono text-[11px] tracking-wide text-cream/50 uppercase">
              <strong className="text-lime font-medium">{item}</strong>
              <span className="text-cream/20">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="grid grid-cols-1 md:grid-cols-[280px_1fr] border-b border-rule reveal" ref={howRef}>
        <div className="hidden md:flex flex-col justify-between p-14 md:p-10 border-r border-rule">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">02 / Method</div>
          <div className="font-serif text-[80px] font-black text-faint leading-none mt-auto">03</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {STEPS.map(s => (
            <div key={s.n} className="p-12 md:p-9 border-b md:border-b-0 md:border-r border-rule last:border-r-0 hover:bg-cream-dark transition-colors duration-250 cursor-default">
              <div className="font-mono text-[10px] text-muted tracking-widest mb-6 flex items-center gap-2.5 after:content-[''] after:flex-1 after:h-px after:bg-faint">Step {s.n}</div>
              <div className="w-10 h-10 border border-rule rounded-lg flex items-center justify-center text-[18px] mb-5 bg-white shadow-sm">{s.icon}</div>
              <div className="font-serif text-[22px] font-black text-ink leading-[1.15] mb-3">{s.title}</div>
              <div className="text-[13px] leading-[1.7] text-muted">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="border-b border-rule reveal" ref={featRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-rule">
          <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-rule">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-5">03 / Features</div>
            <h2 className="font-serif text-[clamp(36px,4.5vw,56px)] font-black leading-[1.08] tracking-tight text-ink">
              Built for developers who want to <em className="italic text-brand-red">actually</em> get hired.
            </h2>
          </div>
          <div className="p-10 md:p-12 flex flex-col justify-end">
            <p className="font-prose text-[17px] leading-[1.7] text-muted italic max-w-[360px]">
              Every feature was designed around one question: what does a developer actually need to go from zero to FAANG offer?
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {FEATURES.map(f => (
            <div key={f.id} className="group border-b sm:border-r border-rule last:border-r-0 p-9 md:p-7 pb-10 relative overflow-hidden hover:bg-cream-dark transition-colors duration-250 cursor-default">
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-lime scale-x-0 origin-left transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              <div className="font-mono text-[10px] text-faint tracking-wide mb-7">{f.id}</div>
              <div className="font-serif text-[20px] font-black text-ink mb-3 leading-[1.2]">{f.title}</div>
              <div className="text-[12.5px] leading-[1.7] text-muted">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section id="testimonials" className="grid grid-cols-1 md:grid-cols-2 border-b border-rule reveal" ref={testiRef}>
        <div className="p-10 md:p-14 md:border-r border-rule bg-ink flex flex-col justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest text-cream/35 mb-8">04 / Early User Feedback</div>
          <div className="font-serif text-[clamp(24px,2.8vw,34px)] font-black italic leading-tight text-cream flex-1 flex items-center">
            "I studied for 6 months on LeetCode and still felt lost. Three weeks on PatternBook and the structure finally clicked."
          </div>
          <div className="flex items-center gap-4 mt-10">
            <div className="w-11 h-11 rounded-full bg-lime flex items-center justify-center font-serif text-[16px] font-black text-lime-dark">JS</div>
            <div>
              <div className="text-[13px] font-semibold text-cream">Julian Smith</div>
              <div className="font-mono text-[10px] text-cream/40 mt-0.5 tracking-tight">Full Stack Developer · Early Adopter</div>
            </div>
          </div>
        </div>
        <div className="p-10 md:p-14 flex flex-col justify-center gap-10">
          {METRICS.map(m => {
            const parts = m.val.match(/^([^×%k]+)([×%k])$/);
            return (
              <div key={m.val} className="border-b border-rule pb-8 last:border-b-0 last:pb-0">
                <div className="font-serif text-[52px] font-black text-ink leading-none tracking-tight">
                  {parts ? <>{parts[1]}<em className="text-brand-red not-italic font-black">{parts[2]}</em></> : m.val}
                </div>
                <div className="text-[13px] text-muted mt-1.5 leading-relaxed">{m.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="border-b border-rule reveal" ref={pricingRef}>
        <div className="p-10 md:px-14 md:py-12 border-b border-rule flex flex-col md:flex-row md:items-end justify-between gap-3">
          <h2 className="font-serif text-[clamp(38px,5vw,62px)] font-black tracking-tight text-ink">Simple, honest pricing.</h2>
          <p className="text-[13px] text-muted max-w-[260px] leading-[1.65] md:text-right">No bait-and-switch. No paywalled problem sets. Just tools that work.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Free */}
          <div className="p-10 md:px-9 md:py-12 border-b md:border-b-0 md:border-r border-rule relative">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-5">Free forever</div>
            <div className="font-serif text-[28px] font-black text-ink mb-1.5">Starter</div>
            <div className="font-serif text-[52px] font-black text-ink leading-none mt-6 mb-1 tracking-tight">₹0</div>
            <div className="text-[12px] text-muted font-mono tracking-wide">no card required</div>
            <div className="h-px bg-rule my-7" />
            <div className="flex flex-col gap-3 mb-8">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2.5 text-[13px] text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-ink shrink-0" />{f}
                </div>
              ))}
            </div>
            <button className="w-full cursor-pointer font-sans text-[13px] font-semibold p-3.25 rounded-[4px] border border-rule bg-transparent text-ink tracking-wide hover:border-ink hover:bg-cream-dark transition-all duration-200" onClick={() => setShowRegister(true)}>Start free →</button>
          </div>
          {/* Pro */}
          <div className="p-10 md:px-9 md:py-12 border-b md:border-b-0 md:border-r border-rule bg-ink relative">
            <div className="absolute top-7 right-7 bg-lime text-lime-dark font-mono text-[9px] tracking-widest uppercase py-1 px-2.5 rounded-full">Most popular</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-5">Best value</div>
            <div className="font-serif text-[28px] font-black text-cream mb-1.5">Pro</div>
            <div className="font-serif text-[52px] font-black text-cream leading-none mt-6 mb-1 tracking-tight">₹499</div>
            <div className="text-[12px] text-cream/70 font-mono tracking-wide">per month · cancel anytime</div>
            <div className="h-px bg-cream/10 my-7" />
            <div className="flex flex-col gap-3 mb-8">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2.5 text-[13px] text-cream/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />{f}
                </div>
              ))}
            </div>
            <button className="w-full cursor-pointer font-sans text-[13px] font-semibold p-3.25 rounded-[4px] border-none bg-lime text-lime-dark tracking-wide hover:bg-lime-light transition-all duration-200" onClick={() => setShowRegister(true)}>Get Pro →</button>
          </div>
          {/* Team */}
          <div className="p-10 md:px-9 md:py-12 border-rule relative">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-5">For teams</div>
            <div className="font-serif text-[28px] font-black text-ink mb-1.5">Team</div>
            <div className="font-serif text-[52px] font-black text-ink leading-none mt-6 mb-1 tracking-tight">₹299</div>
            <div className="text-[12px] text-muted font-mono tracking-wide">per seat / month · min 5 seats</div>
            <div className="h-px bg-rule my-7" />
            <div className="flex flex-col gap-3 mb-8">
              {TEAM_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2.5 text-[13px] text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-ink shrink-0" />{f}
                </div>
              ))}
            </div>
            <button className="w-full cursor-pointer font-sans text-[13px] font-semibold p-3.25 rounded-[4px] border border-rule bg-transparent text-ink tracking-wide hover:border-ink hover:bg-cream-dark transition-all duration-200">Contact sales →</button>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center p-10 md:p-14 border-b border-rule gap-12 bg-cream-dark reveal" ref={ctaRef}>
        <h2 className="font-serif text-[clamp(34px,4.5vw,54px)] font-black leading-[1.05] tracking-tight text-ink">
          Your next offer is<br />a <em className="italic text-brand-red">structure</em> problem.
        </h2>
        <div className="flex flex-col gap-2.5 items-start md:items-end shrink-0">
          <button className="cursor-pointer bg-lime text-lime-dark border-none font-sans text-[14px] font-bold py-4 px-10 rounded-[4px] tracking-wide hover:bg-lime-light transition-all duration-200" onClick={() => setShowRegister(true)}>
            Start learning free →
          </button>
          <div className="font-mono text-[10px] text-muted tracking-wide text-left md:text-right">No credit card · 2 min setup · cancel anytime</div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-ink border-t border-rule/20 pt-20 pb-10">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-1">
              <div className="font-serif text-[28px] font-black text-cream mb-6 select-none flex items-center gap-2">
                <span>Pattern<em className="text-brand-red italic">Book</em></span>
                <span className="font-mono text-[8px] border border-lime/30 text-lime px-1.5 py-0.5 rounded-[2px] tracking-widest uppercase leading-none -translate-y-2.5 opacity-80">Beta</span>
              </div>
              <p className="text-[14px] text-cream/50 leading-relaxed mb-8 max-w-[240px]">
                The pattern-first roadmap for developers who want to master the art of problem-solving, not just memorize solutions.
              </p>
              <div className="flex gap-4">
                {["X", "GH", "DS"].map(s => (
                  <div key={s} className="w-8 h-8 rounded-full border border-cream/10 flex items-center justify-center text-[10px] font-mono text-cream/40 hover:text-lime hover:border-lime transition-all cursor-pointer">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: "Curriculum", links: ["Arrays & Hashing", "Two Pointers", "Sliding Window", "Trees & Graphs", "Dynamic Programming"] },
              { title: "Platform", links: ["Pattern Roadmap", "Success Stories", "Mock Interviews", "Beta Access", "Changelog"] },
              { title: "Community", links: ["Discord Server", "Pattern Index", "Manifesto", "Open Source", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-cream/30 mb-8">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-[13px] text-cream/60 hover:text-cream transition-colors duration-200 no-underline">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-cream/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-mono text-[10px] text-cream/20 tracking-wider">
              © 2026 PATTERNBOOK LABS · CRAFTED FOR THE TOP 1%
            </div>
            <div className="flex gap-8">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
                <a key={l} href="#" className="font-mono text-[10px] text-cream/20 hover:text-cream/50 no-underline transition-colors uppercase tracking-widest">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}