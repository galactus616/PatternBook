import React, { useState } from 'react';
import { useAdmin } from '../../features/admin/useAdmin';
import { CreditCard, CheckCircle2, XCircle, Search, User, FileText, Calendar } from 'lucide-react';

const STATUS_BADGE = {
  captured: { text: 'text-lime-dark',  bg: 'bg-lime/10 border-lime/30',        icon: CheckCircle2 },
  failed:   { text: 'text-brand-red',  bg: 'bg-brand-red/10 border-brand-red/20', icon: XCircle },
  pending:  { text: 'text-orange-700', bg: 'bg-accent/10 border-accent/30',    icon: Clock },
};

function Clock(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}

export default function Payments() {
  const { transactions, revenueStats } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = transactions.filter(t => {
    const matchSearch = t.userName.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const fmtAmount = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Finance</p>
          </div>
          <h1 className="font-serif text-[36px] font-black text-ink leading-none mb-2">Payments</h1>
          <p className="font-sans text-[13px] text-muted">All Razorpay transactions — read-only view</p>
        </div>
      </div>

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-ink rounded-[20px] p-6 shadow-lg relative overflow-hidden border border-ink">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime opacity-10 rounded-full blur-3xl" />
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 shrink-0">
            <CreditCard size={18} className="text-lime" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1">Total Revenue</p>
          <p className="font-serif text-[36px] font-black text-cream leading-none">{fmtAmount(revenueStats.totalRevenue)}</p>
          <p className="font-mono text-[9px] text-lime uppercase tracking-widest mt-2">From successful orders</p>
        </div>
        
        <div className="bg-white border border-rule rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-cream-dark flex items-center justify-center mb-4 shrink-0">
            <CheckCircle2 size={18} className="text-lime-dark" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">Successful</p>
          <p className="font-serif text-[36px] font-black text-ink leading-none">{revenueStats.successfulOrders}</p>
          <p className="font-mono text-[9px] text-muted uppercase tracking-widest mt-2">Orders captured</p>
        </div>

        <div className="bg-white border border-rule rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-cream-dark flex items-center justify-center mb-4 shrink-0">
            <XCircle size={18} className="text-brand-red" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">Failed</p>
          <p className="font-serif text-[36px] font-black text-ink leading-none">{revenueStats.failedOrders}</p>
          <p className="font-mono text-[9px] text-muted uppercase tracking-widest mt-2">Failed orders</p>
        </div>

        <div className="bg-white border border-rule rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
             <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Plan Breakdown</p>
             <div className="space-y-3">
               {Object.entries(revenueStats.planBreakdown).map(([plan, count]) => (
                 <div key={plan} className="flex justify-between items-center pb-3 border-b border-rule/50 last:border-0 last:pb-0">
                   <span className={`font-mono text-[10px] px-2 py-0.5 rounded-lg border uppercase tracking-widest ${
                     plan === 'PRO' ? 'bg-lime/10 text-lime-dark border-lime/30' : 
                     plan === 'TEAM' ? 'bg-accent/10 text-orange-700 border-accent/30' : 
                     'bg-cream-dark text-muted border-rule'
                   }`}>
                     {plan}
                   </span>
                   <span className="font-mono text-[14px] font-bold text-ink">{count}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="space-y-3 mb-7">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative group flex-1 min-w-[220px] max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/50 group-focus-within:text-ink transition-colors" />
            <input 
              type="text" 
              placeholder="Search by user or email..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full bg-white border border-rule rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-ink/40 focus:shadow-sm transition-all placeholder:text-muted/40" 
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-rule rounded-xl">
            {[
              { key: 'ALL', label: 'All', active: 'bg-ink text-cream' },
              { key: 'captured', label: 'Captured', active: 'bg-lime text-lime-dark' },
              { key: 'failed', label: 'Failed', active: 'bg-brand-red text-white' },
              { key: 'pending', label: 'Pending', active: 'bg-accent text-white' },
            ].map(({ key, label, active }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3.5 py-1.5 cursor-pointer rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all
                  ${statusFilter === key ? `${active} shadow-sm` : 'text-muted hover:text-ink'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="font-mono text-[10px] text-muted uppercase tracking-widest ml-auto">
            {filtered.length} / {transactions.length}
          </span>
        </div>
      </div>

      {/* ── Data Table ───────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="bg-white border border-rule rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/40 border-b border-rule">
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-[250px]">Customer</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Order ID</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Plan / Coupon</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Status</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Date</th>
                <th className="text-right px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/40">
              {filtered.map((t) => {
                const status = STATUS_BADGE[t.status] || STATUS_BADGE.pending;
                const Icon = status.icon;
                return (
                  <tr key={t.id} className="hover:bg-cream/60 transition-colors group/row">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-cream text-[11px] font-bold shrink-0">
                          {(t.userName || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-sans text-[13px] font-bold text-ink truncate">{t.userName}</p>
                          <p className="font-mono text-[10px] text-muted truncate">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <FileText size={12} className="text-muted/50" />
                        <code className="font-mono text-[11px] font-bold text-ink">{t.razorpayOrderId}</code>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink">{t.plan}</span>
                        {t.coupon && (
                          <code className="font-mono text-[9px] bg-lime/10 text-lime-dark border border-lime/30 px-1.5 py-0.5 rounded-md">
                            {t.coupon}
                          </code>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded-lg uppercase tracking-wider border ${status.bg} ${status.text}`}>
                        <Icon size={10} />
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-muted/50" />
                        <span className="font-mono text-[11px] text-muted">{t.createdAt}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono text-[14px] font-black text-ink">{fmtAmount(t.amount)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rule rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center mb-4">
            <CreditCard size={24} className="text-muted" />
          </div>
          <h3 className="font-serif text-[22px] font-black text-ink mb-1">No transactions found</h3>
          <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-6">There are no payments matching this filter</p>
        </div>
      )}
    </div>
  );
}
