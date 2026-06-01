import React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import {
  Users, BookOpen, Layers, Code2, BarChart3,
  TrendingUp, CheckCircle2, Flame, ArrowRight,
  CreditCard, Tag, ShieldCheck, Zap
} from 'lucide-react';

// ─── Small reusable pieces ───────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2 mb-1">
    <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{children}</p>
  </div>
);

const HeroStat = ({ label, value, sub, accent }) => (
  <div className="flex flex-col gap-1">
    <p className="font-mono text-[9px] uppercase tracking-widest text-muted">{label}</p>
    <div className="flex items-baseline gap-1.5">
      <span className={`font-serif text-[38px] font-black leading-none ${accent || 'text-ink'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      {sub && <span className="font-mono text-[10px] text-muted uppercase tracking-wider">{sub}</span>}
    </div>
  </div>
);

const MetricCard = ({ label, value, icon: Icon, change }) => (
  <div className="bg-white border border-rule rounded-[4px] p-5 shadow-sm group hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</p>
      <div className="w-8 h-8 rounded-[4px] bg-cream border border-rule flex items-center justify-center">
        <Icon size={14} className="text-muted" />
      </div>
    </div>
    <p className="font-serif text-[28px] font-black text-ink leading-none">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </p>
    {change && <p className="font-mono text-[9px] text-muted mt-2 uppercase tracking-widest">{change}</p>}
  </div>
);

const HorizBar = ({ label, value, max, colorClass }) => (
  <div className="flex items-center gap-4">
    <p className="font-sans text-[12px] font-semibold text-ink w-44 shrink-0 truncate">{label}</p>
    <div className="flex-1 h-1.5 bg-cream rounded-full overflow-hidden border border-rule/50">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${Math.max(4, Math.round((value / max) * 100))}%` }}
      />
    </div>
    <p className="font-mono text-[11px] font-bold text-ink w-10 text-right shrink-0">
      {value.toLocaleString()}
    </p>
  </div>
);

const QuickLink = ({ to, label, sub, icon: Icon }) => (
  <Link
    to={to}
    className="group flex items-center justify-between px-4 py-3 rounded-[4px] border border-rule bg-white hover:border-ink hover:shadow-sm transition-all duration-200"
  >
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-[4px] bg-cream flex items-center justify-center border border-rule group-hover:bg-ink group-hover:border-ink transition-all duration-200">
        <Icon size={13} className="text-ink group-hover:text-cream transition-colors duration-200" />
      </div>
      <div>
        <p className="text-[12px] font-semibold text-ink">{label}</p>
        <p className="font-mono text-[9px] text-muted uppercase tracking-widest">{sub}</p>
      </div>
    </div>
    <ArrowRight size={13} className="text-muted group-hover:text-ink group-hover:translate-x-0.5 transition-all duration-200" />
  </Link>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useAuth();
  const { analytics, problems, topics, users, transactions, revenueStats, coupons } = useAdmin();

  const totalRevenueFmt = `₹${(revenueStats.totalRevenue / 100).toFixed(0)}`;
  const topProblems = [...problems].sort((a, b) => b.solved - a.solved).slice(0, 6);
  const maxSolves = topProblems[0]?.solved ?? 1;
  const sortedTopics = [...topics].sort((a, b) => b.problemCount - a.problemCount).slice(0, 5);
  const maxTopicProbs = sortedTopics[0]?.problemCount ?? 1;

  const diffData = [
    { label: 'Easy',   value: analytics.easyProblems,   pct: Math.round((analytics.easyProblems / analytics.totalProblems) * 100),   color: 'bg-lime'       },
    { label: 'Medium', value: analytics.mediumProblems,  pct: Math.round((analytics.mediumProblems / analytics.totalProblems) * 100), color: 'bg-accent'     },
    { label: 'Hard',   value: analytics.hardProblems,    pct: Math.round((analytics.hardProblems / analytics.totalProblems) * 100),   color: 'bg-brand-red'  },
  ];

  const activeCoupons   = coupons.filter(c => c.isActive).length;
  const successfulTx    = transactions.filter(t => t.status === 'captured').length;

  return (
    <div className="max-w-[1200px] mx-auto px-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 pb-12">

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="relative bg-ink rounded-[4px] overflow-hidden p-8">
        {/* Decorative grain-like texture */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #b8ff57 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d63a2f 0%, transparent 40%)' }} />

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Left — greeting */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-brand-red" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Admin Console</span>
            </div>
            <h1 className="font-serif text-[40px] font-black text-cream leading-[1.1]">
              Good morning, <br />
              <em className="text-brand-red italic">{user?.name?.split(' ')[0] || 'Admin'}</em>.
            </h1>
            <p className="font-mono text-[11px] text-white/40 uppercase tracking-widest">
              PatternBook Admin · Hardcoded Preview Mode
            </p>
          </div>

          {/* Right — hero stats */}
          <div className="flex gap-8 md:gap-12 flex-wrap">
            <HeroStat label="Total Users"   value={analytics.totalUsers}    sub="members" />
            <div className="w-px h-12 bg-white/10 hidden md:block self-center" />
            <HeroStat label="Total Problems" value={analytics.totalProblems} sub="problems" />
            <div className="w-px h-12 bg-white/10 hidden md:block self-center" />
            <HeroStat label="Total Solves"   value={analytics.totalSolves}   sub="all time" />
            <div className="w-px h-12 bg-white/10 hidden md:block self-center" />
            <HeroStat label="Revenue"        value={totalRevenueFmt}         accent="text-lime" />
          </div>
        </div>
      </div>

      {/* ── Metric cards ────────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Content Overview</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
          <MetricCard label="Topics"    value={analytics.totalTopics}   icon={BookOpen}  change={`${analytics.totalProblems} problems linked`} />
          <MetricCard label="Patterns"  value={analytics.totalPatterns} icon={Layers}    change="Across all topics" />
          <MetricCard label="Pro Users" value={analytics.proUsers}      icon={Zap}       change="Active PRO subscriptions" />
          <MetricCard label="Coupons"   value={activeCoupons}           icon={Tag}       change={`${coupons.length - activeCoupons} inactive`} />
        </div>
      </div>

      {/* ── Difficulty + Revenue row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Difficulty distribution */}
        <div className="lg:col-span-5 bg-white border border-rule rounded-[4px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <SectionLabel>Difficulty Split</SectionLabel>
            <p className="font-mono text-[8px] text-muted/50 uppercase tracking-widest">{analytics.totalProblems} total</p>
          </div>

          {/* Stacked bar */}
          <div className="flex rounded-full overflow-hidden h-3 gap-0.5 mb-5">
            {diffData.map(d => (
              <div key={d.label} className={`${d.color} transition-all duration-700`} style={{ width: `${d.pct}%` }} title={`${d.label}: ${d.value}`} />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-4">
            {diffData.map(d => (
              <div key={d.label} className="text-center">
                <div className={`w-2 h-2 rounded-full ${d.color} mx-auto mb-1.5`} />
                <p className="font-serif text-[22px] font-black text-ink leading-none">{d.value}</p>
                <p className="font-mono text-[8px] text-muted uppercase tracking-widest mt-1">{d.label} · {d.pct}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue */}
        <div className="lg:col-span-4 bg-white border border-rule rounded-[4px] p-6 shadow-sm">
          <div className="mb-5"><SectionLabel>Revenue</SectionLabel></div>
          <p className="font-serif text-[36px] font-black text-ink leading-none mb-1">{totalRevenueFmt}</p>
          <p className="font-mono text-[9px] text-lime-dark uppercase tracking-widest mb-5">From {successfulTx} successful payments</p>

          <div className="space-y-3 border-t border-rule pt-4">
            {Object.entries(revenueStats.planBreakdown).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${plan === 'PRO' ? 'bg-lime' : plan === 'TEAM' ? 'bg-accent' : 'bg-faint'}`} />
                  <span className={`font-mono text-[11px] uppercase tracking-widest ${plan === 'PRO' ? 'text-lime-dark font-bold' : plan === 'TEAM' ? 'text-accent font-bold' : 'text-muted'}`}>{plan}</span>
                </div>
                <span className="font-mono text-[13px] font-black text-ink">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users breakdown */}
        <div className="lg:col-span-3 bg-white border border-rule rounded-[4px] p-6 shadow-sm">
          <div className="mb-5"><SectionLabel>Users</SectionLabel></div>
          <p className="font-serif text-[36px] font-black text-ink leading-none mb-1">{analytics.totalUsers}</p>
          <p className="font-mono text-[9px] text-muted uppercase tracking-widest mb-5">Total members</p>

          <div className="space-y-3 border-t border-rule pt-4">
            {[
              { label: 'Admin',     count: users.filter(u => u.role === 'ADMIN').length,     color: 'bg-brand-red' },
              { label: 'Moderator', count: users.filter(u => u.role === 'MODERATOR').length, color: 'bg-accent'    },
              { label: 'User',      count: users.filter(u => u.role === 'USER').length,      color: 'bg-faint'     },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="font-mono text-[11px] text-muted uppercase tracking-widest">{label}</span>
                </div>
                <span className="font-mono text-[13px] font-black text-ink">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Charts row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Most solved problems */}
        <div className="bg-white border border-rule rounded-[4px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <SectionLabel>Most Solved Problems</SectionLabel>
            <p className="font-mono text-[8px] text-muted/50 uppercase tracking-widest italic">By solve count</p>
          </div>
          <div className="space-y-4">
            {topProblems.map(p => (
              <HorizBar key={p.id} label={p.title} value={p.solved} max={maxSolves} colorClass="bg-brand-red" />
            ))}
          </div>
        </div>

        {/* Top topics */}
        <div className="bg-white border border-rule rounded-[4px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <SectionLabel>Topics by Problem Count</SectionLabel>
            <p className="font-mono text-[8px] text-muted/50 uppercase tracking-widest italic">Top 5</p>
          </div>
          <div className="space-y-4">
            {sortedTopics.map(t => (
              <HorizBar key={t.id} label={t.name} value={t.problemCount} max={maxTopicProbs} colorClass="bg-ink" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick access ────────────────────────────────────────────────── */}
      <div>
        <SectionLabel>Quick Access</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          <QuickLink to="/admin/topics"    label="Topics"    sub={`${analytics.totalTopics} topics`}       icon={BookOpen}   />
          <QuickLink to="/admin/patterns"  label="Patterns"  sub={`${analytics.totalPatterns} patterns`}   icon={Layers}     />
          <QuickLink to="/admin/problems"  label="Problems"  sub={`${analytics.totalProblems} problems`}   icon={Code2}      />
          <QuickLink to="/admin/users"     label="Users"     sub={`${analytics.totalUsers} members`}       icon={Users}      />
          <QuickLink to="/admin/payments"  label="Payments"  sub={`${successfulTx} transactions`}          icon={CreditCard} />
          <QuickLink to="/admin/coupons"   label="Coupons"   sub={`${activeCoupons} active`}               icon={Tag}        />
        </div>
      </div>

    </div>
  );
}
