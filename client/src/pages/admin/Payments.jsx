import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { CreditCard, TrendingUp, CheckCircle2, XCircle, Search } from 'lucide-react';

const STATUS_BADGE = {
  captured: 'bg-lime/10 text-lime-dark border border-lime/30',
  failed:   'bg-brand-red/10 text-brand-red border border-brand-red/30',
  pending:  'bg-accent/10 text-accent border border-accent/30',
};

export default function Payments() {
  const { transactions, revenueStats } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = transactions.filter(t => {
    const matchSearch = t.userName.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const fmtAmount = (paise) => `₹${(paise / 100).toFixed(0)}`;

  return (
    <div className="max-w-[1200px] mx-auto px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 pb-10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Revenue</p>
        </div>
        <h1 className="font-serif text-[28px] font-black text-ink">Payments</h1>
        <p className="text-muted text-sm mt-1">All Razorpay transactions — read-only view</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-rule rounded-[4px] p-6 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Total Revenue</p>
          <p className="font-serif text-[28px] font-black text-ink">{fmtAmount(revenueStats.totalRevenue)}</p>
          <p className="font-mono text-[9px] text-lime-dark mt-1">From successful orders</p>
        </div>
        <div className="bg-white border border-rule rounded-[4px] p-6 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Successful</p>
          <p className="font-serif text-[28px] font-black text-ink">{revenueStats.successfulOrders}</p>
          <div className="flex items-center gap-1 mt-1"><CheckCircle2 size={11} className="text-lime-dark" /><span className="font-mono text-[9px] text-lime-dark">Orders captured</span></div>
        </div>
        <div className="bg-white border border-rule rounded-[4px] p-6 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Failed</p>
          <p className="font-serif text-[28px] font-black text-ink">{revenueStats.failedOrders}</p>
          <div className="flex items-center gap-1 mt-1"><XCircle size={11} className="text-brand-red" /><span className="font-mono text-[9px] text-brand-red">Failed orders</span></div>
        </div>
        <div className="bg-white border border-rule rounded-[4px] p-6 shadow-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Plan Breakdown</p>
          <div className="space-y-1 mt-2">
            {Object.entries(revenueStats.planBreakdown).map(([plan, count]) => (
              <div key={plan} className="flex justify-between items-center">
                <span className={`font-mono text-[10px] uppercase tracking-widest ${plan === 'PRO' ? 'text-lime-dark font-bold' : plan === 'TEAM' ? 'text-accent font-bold' : 'text-muted'}`}>{plan}</span>
                <span className="font-mono text-[12px] font-bold text-ink">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-white border border-rule rounded-[4px] shadow-sm">
        <div className="p-6 border-b border-rule flex items-center gap-4 flex-wrap">
          <div className="relative group flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
            <input type="text" placeholder="Search by user..." value={search} onChange={e => setSearch(e.target.value)} className="bg-cream-dark/50 border border-rule/50 rounded-[4px] pl-9 pr-4 py-1.5 text-[12px] w-full focus:outline-none focus:border-ink focus:bg-white transition-all placeholder:text-muted/60" />
          </div>
          <div className="flex gap-1">
            {['ALL', 'captured', 'failed', 'pending'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 cursor-pointer rounded-[4px] font-mono text-[10px] uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-ink text-cream' : 'bg-cream text-muted border border-rule hover:text-ink'}`}>{s}</button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule">
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">User</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Order ID</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Plan</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Coupon</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Status</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Date</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-rule/60 last:border-0 hover:bg-cream/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-sans text-[13px] font-semibold text-ink">{t.userName}</p>
                  <p className="font-mono text-[10px] text-muted">{t.email}</p>
                </td>
                <td className="px-6 py-4"><code className="font-mono text-[11px] bg-cream px-2 py-0.5 rounded-[4px] text-muted border border-rule/60">{t.razorpayOrderId}</code></td>
                <td className="px-6 py-4 font-mono text-[11px] text-muted uppercase">{t.plan}</td>
                <td className="px-6 py-4">
                  {t.coupon
                    ? <code className="font-mono text-[10px] bg-lime/10 text-lime-dark px-2 py-0.5 rounded-[4px] border border-lime/30">{t.coupon}</code>
                    : <span className="text-muted/30 text-[12px]">—</span>
                  }
                </td>
                <td className="px-6 py-4">
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-[4px] uppercase tracking-wider border ${STATUS_BADGE[t.status] || STATUS_BADGE.pending}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-[11px] text-muted">{t.createdAt}</td>
                <td className="px-6 py-4 text-right font-mono text-[13px] font-bold text-ink">{fmtAmount(t.amount)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center"><p className="font-mono text-[11px] text-muted uppercase tracking-widest">No transactions found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
