import React from 'react';
import { useAdmin } from '../../features/admin/useAdmin';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import {
  Users, BookOpen, Layers, Code2,
  TrendingUp, ArrowUpRight, CreditCard, Tag, 
  ShieldCheck, Zap, Network, Activity, 
  ChevronRight, ArrowRight, BarChart3, Clock
} from 'lucide-react';

// ─── Utility ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatCurrency(amount) {
  if (!amount) return '₹0';
  return `₹${(amount / 100).toLocaleString('en-IN')}`;
}

// ─── Bento Card Components ───────────────────────────────────────────────────

function MetricCard({ title, value, icon: Icon, trend, sub, accent = false, to }) {
  const CardContent = (
    <div className={`relative overflow-hidden rounded-[20px] p-6 h-full flex flex-col justify-between group transition-all duration-300 border
      ${accent 
        ? 'bg-ink border-ink text-cream hover:shadow-xl hover:shadow-ink/20' 
        : 'bg-white border-rule hover:border-ink/20 hover:shadow-md'}`}
    >
      {accent && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${accent ? 'bg-white/10' : 'bg-cream-dark border border-rule/50'}`}
        >
          <Icon size={18} className={accent ? 'text-lime' : 'text-ink'} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg
            ${trend > 0 ? 'bg-lime/20 text-lime-dark' : 'bg-brand-red/10 text-brand-red'}`}
          >
            <TrendingUp size={10} className={trend < 0 ? 'rotate-180' : ''} />
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
        {to && !trend && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
            ${accent ? 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white' : 'bg-cream text-muted group-hover:bg-ink group-hover:text-cream'}`}
          >
            <ArrowUpRight size={14} />
          </div>
        )}
      </div>

      <div>
        <p className={`font-serif text-[36px] font-black leading-none mb-2 ${accent ? 'text-cream' : 'text-ink'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className={`font-mono text-[10px] uppercase tracking-widest ${accent ? 'text-white/60' : 'text-muted'}`}>
          {title}
        </p>
        {sub && (
          <p className={`font-sans text-[12px] mt-1 ${accent ? 'text-white/40' : 'text-muted/70'}`}>{sub}</p>
        )}
      </div>
    </div>
  );

  return to ? <Link to={to} className="block h-full">{CardContent}</Link> : CardContent;
}

function ListCard({ title, items, renderItem, icon: Icon, to, emptyMsg = "No data" }) {
  return (
    <div className="bg-white border border-rule rounded-[20px] p-6 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cream-dark border border-rule/50 flex items-center justify-center text-ink shrink-0">
            <Icon size={14} />
          </div>
          <h2 className="font-sans text-[15px] font-bold text-ink">{title}</h2>
        </div>
        {to && (
          <Link to={to} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted hover:bg-ink hover:text-cream transition-colors">
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
      <div className="flex-1 space-y-4">
        {items.length > 0 ? items.map(renderItem) : (
          <div className="h-full flex items-center justify-center pb-4">
            <p className="font-mono text-[11px] text-muted uppercase tracking-widest">{emptyMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Badges & Micro UI ───────────────────────────────────────────────────────

function PlanBadge({ plan }) {
  const styles = {
    PRO:  'bg-lime/20 text-lime-dark border-lime/30',
    TEAM: 'bg-accent/10 text-orange-700 border-accent/30',
    FREE: 'bg-cream-dark text-muted border-rule',
  };
  return (
    <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md border ${styles[plan] || styles.FREE}`}>
      {plan}
    </span>
  );
}

function DiffBadge({ diff }) {
  const styles = {
    EASY: 'bg-lime text-lime-dark',
    MEDIUM: 'bg-accent text-white',
    HARD: 'bg-brand-red text-white'
  };
  return (
    <span className={`w-2 h-2 rounded-full ${styles[diff] || 'bg-muted'}`} title={diff} />
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useAuth();
  const { analytics, problems, topics, users, transactions, revenueStats, coupons } = useAdmin();

  // Data processing
  const topProblems = [...(problems || [])].sort((a, b) => (b.solved ?? 0) - (a.solved ?? 0)).slice(0, 5);
  const topTopics = [...(topics || [])].sort((a, b) => (b.problemCount ?? 0) - (a.problemCount ?? 0)).slice(0, 5);
  const recentUsers = [...(users || [])].slice(0, 4);
  const activeCoupons = (coupons || []).filter(c => c.isActive).length;
  const successfulTx = (transactions || []).filter(t => t.status === 'captured').length;
  const proUsers = (users || []).filter(u => u.plan === 'PRO').length;
  const totalRev = formatCurrency(revenueStats?.totalRevenue);

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime/20 border border-lime/30">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-dark animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-lime-dark font-bold">System Online</span>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">Admin Console</p>
          </div>
          <h1 className="font-serif text-[42px] font-black text-ink leading-[1.1]">
            {getGreeting()}, <span className="text-muted">{user?.name?.split(' ')[0] || 'Admin'}</span>
          </h1>
        </div>
        
        <div className="flex gap-2">
          {/* Quick Actions Header */}
          <Link to="/admin/problems" className="px-4 py-2 bg-white border border-rule rounded-xl font-mono text-[11px] uppercase tracking-widest text-ink hover:bg-cream transition-colors shadow-sm">
            + New Problem
          </Link>
          <Link to="/admin/coupons" className="px-4 py-2 bg-ink border border-ink rounded-xl font-mono text-[11px] uppercase tracking-widest text-cream hover:bg-ink/90 transition-colors shadow-sm">
            + New Coupon
          </Link>
        </div>
      </div>

      {/* ── Bento Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {/* Core Metrics row */}
        <MetricCard title="Total Revenue" value={totalRev} sub={`${successfulTx} total transactions`} icon={CreditCard} accent to="/admin/payments" />
        <MetricCard title="Pro Subscribers" value={proUsers} sub="Active PRO accounts" icon={Zap} trend={12} to="/admin/users" />
        <MetricCard title="Total Users" value={analytics?.totalUsers ?? 0} sub="Registered accounts" icon={Users} trend={4} to="/admin/users" />
        <MetricCard title="Total Problems" value={analytics?.totalProblems ?? 0} sub="Across all topics" icon={Code2} to="/admin/problems" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Left Col (Span 2): Content Data */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <ListCard 
            title="Most Solved Problems" 
            icon={Activity} 
            to="/admin/problems"
            items={topProblems}
            renderItem={(p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-dark transition-colors group">
                <span className="font-mono text-[10px] text-muted w-4 shrink-0 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <DiffBadge diff={p.difficulty} />
                    <p className="font-sans text-[13px] font-bold text-ink truncate">{p.title}</p>
                  </div>
                  <p className="font-mono text-[10px] text-muted truncate mt-0.5">{p.topic}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-[13px] font-bold text-ink">{p.solved?.toLocaleString() ?? 0}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted">solves</p>
                </div>
              </div>
            )}
          />

          <ListCard 
            title="Top Topics" 
            icon={BookOpen} 
            to="/admin/topics"
            items={topTopics}
            renderItem={(t, i) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-dark transition-colors">
                <span className="font-mono text-[10px] text-muted w-4 shrink-0 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[13px] font-bold text-ink truncate">{t.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-[13px] font-bold text-ink">{t.problemCount ?? 0}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted">problems</p>
                </div>
              </div>
            )}
          />

        </div>

        {/* Right Col (Span 1): System Status & Users */}
        <div className="space-y-4 flex flex-col">
          
          {/* Health Card */}
          <div className="bg-ink rounded-[20px] p-6 relative overflow-hidden border border-ink shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime opacity-5 rounded-full blur-3xl" />
            <div className="flex items-center gap-2.5 mb-6 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-cream shrink-0">
                <ShieldCheck size={14} />
              </div>
              <h2 className="font-sans text-[15px] font-bold text-cream">Platform Health</h2>
            </div>
            <div className="space-y-4 relative z-10">
              {[
                { label: 'Topics', val: analytics?.totalTopics ?? 0, icon: BookOpen, color: 'text-lime' },
                { label: 'Patterns', val: analytics?.totalPatterns ?? 0, icon: Layers, color: 'text-accent' },
                { label: 'Sub-Patterns', val: analytics?.totalSubPatterns ?? 0, icon: Network, color: 'text-blue-400' },
                { label: 'Active Coupons', val: activeCoupons, icon: Tag, color: 'text-brand-red' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <stat.icon size={14} className={stat.color} />
                    <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">{stat.label}</span>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-cream">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white border border-rule rounded-[20px] p-6 hover:shadow-md transition-shadow">
             <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cream-dark border border-rule/50 flex items-center justify-center text-ink shrink-0">
                  <Clock size={14} />
                </div>
                <h2 className="font-sans text-[15px] font-bold text-ink">Recent Signups</h2>
              </div>
              <Link to="/admin/users" className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted hover:bg-ink hover:text-cream transition-colors">
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-ink text-cream flex items-center justify-center text-[10px] font-bold shrink-0">
                      {(u.name || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-[13px] font-semibold text-ink truncate">{u.name}</p>
                      <p className="font-mono text-[9px] text-muted truncate">{u.email}</p>
                    </div>
                  </div>
                  <PlanBadge plan={u.plan} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
