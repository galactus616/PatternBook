import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../features/admin/useAdmin';
import { Search, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Tag, ArrowUpRight } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';

import CouponForm from '../../features/admin/components/CouponForm';
import ConfirmDelete from '../../features/admin/components/ConfirmDelete';

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rule rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center mb-4">
        <Tag size={24} className="text-lime" />
      </div>
      <h3 className="font-serif text-[22px] font-black text-ink mb-1">No coupons found</h3>
      <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-6">Create promotional codes for your users</p>
      <button
        onClick={onAdd}
        className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-ink/90 transition-all"
      >
        <Plus size={14} /> Create Coupon
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Coupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modal, setModal] = useState(null);

  const filtered = useMemo(() => coupons.filter(c => {
    const matchSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || 
                        (statusFilter === 'ACTIVE' && c.isActive) || 
                        (statusFilter === 'INACTIVE' && !c.isActive);
    return matchSearch && matchStatus;
  }), [coupons, search, statusFilter]);

  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.type === 'add') addCoupon(form);
    else updateCoupon(modal.coupon.id, form);
    closeModal();
  };

  const activeCount = coupons.filter(c => c.isActive).length;
  const inactiveCount = coupons.length - activeCount;

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Promotions</p>
          </div>
          <h1 className="font-serif text-[36px] font-black text-ink leading-none mb-2">Coupons</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-sans text-[13px] text-muted">
              <span className="font-bold text-ink">{coupons.length}</span> coupon codes in the system
            </p>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] text-lime-dark bg-lime/10 border border-lime/30 px-2 py-0.5 rounded-lg">{activeCount} active</span>
              <span className="font-mono text-[9px] text-muted bg-cream-dark border border-rule px-2 py-0.5 rounded-lg">{inactiveCount} inactive</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setModal({ type: 'add' })} 
          className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-5 py-3 rounded-xl text-[13px] font-semibold hover:bg-ink/90 transition-all shadow-sm hover:shadow-md group"
        >
          <Plus size={15} />
          New Coupon
          <ArrowUpRight size={12} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </button>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="space-y-3 mb-7">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative group flex-1 min-w-[220px] max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/50 group-focus-within:text-ink transition-colors" />
            <input 
              type="text" 
              placeholder="Search coupon code..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full bg-white border border-rule rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-ink/40 focus:shadow-sm transition-all placeholder:text-muted/40" 
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-rule rounded-xl">
            {[
              { key: 'ALL', label: 'All', active: 'bg-ink text-cream' },
              { key: 'ACTIVE', label: 'Active', active: 'bg-lime text-lime-dark' },
              { key: 'INACTIVE', label: 'Inactive', active: 'bg-cream-dark text-muted border border-rule' },
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
            {filtered.length} / {coupons.length}
          </span>
        </div>
      </div>

      {/* ── Data Table ───────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="bg-white border border-rule rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/40 border-b border-rule">
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Code</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Discount</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Usage</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Expiry</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Status</th>
                <th className="text-right px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/40">
              {filtered.map((c) => (
                <tr key={c.id} className={`transition-colors group/row ${c.isActive ? 'hover:bg-cream/60' : 'bg-cream-dark/30 hover:bg-cream-dark/60'}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.isActive ? 'bg-ink/5 border border-rule/60' : 'bg-transparent'}`}>
                        <Tag size={14} className={c.isActive ? 'text-muted' : 'text-muted/40'} />
                      </div>
                      <code className={`font-mono text-[14px] font-bold ${c.isActive ? 'text-ink' : 'text-muted/60'}`}>
                        {c.code}
                      </code>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-mono text-[14px] font-bold ${c.isActive ? 'text-ink' : 'text-muted/60'}`}>
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                    </span>
                    <span className="font-mono text-[9px] text-muted ml-1.5 uppercase">{c.discountType}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[12px] font-semibold ${c.isActive ? 'text-ink' : 'text-muted/60'}`}>{c.usedCount}</span>
                      <span className="text-muted/40">/</span>
                      <span className="font-mono text-[12px] text-muted">{c.maxUses ?? '∞'}</span>
                    </div>
                    {c.maxUses && (
                      <div className="h-1.5 w-24 bg-cream rounded-full mt-1.5 overflow-hidden border border-rule/60">
                        <div 
                          className={`h-full rounded-full transition-all ${c.isActive ? 'bg-ink' : 'bg-muted/40'}`} 
                          style={{ width: `${Math.min(100, (c.usedCount / c.maxUses) * 100)}%` }} 
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-muted">{c.expiryDate || '—'}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleCoupon(c.id)} className="flex items-center cursor-pointer gap-2 transition-all">
                      {c.isActive
                        ? <><ToggleRight size={22} className="text-lime-dark" /><span className="font-mono text-[10px] text-lime-dark uppercase tracking-wider font-bold">Active</span></>
                        : <><ToggleLeft size={22} className="text-muted/60" /><span className="font-mono text-[10px] text-muted/60 uppercase tracking-wider">Inactive</span></>
                      }
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <button onClick={() => setModal({ type: 'edit', coupon: c })} className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-ink hover:bg-cream-dark transition-all" title="Edit">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setModal({ type: 'delete', coupon: c })} className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState onAdd={() => setModal({ type: 'add' })} />
      )}

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {modal?.type === 'add' && (
        <AdminModal title="Create Coupon" onClose={closeModal}>
          <CouponForm onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'edit' && (
        <AdminModal title="Edit Coupon" onClose={closeModal}>
          <CouponForm initial={modal.coupon} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'delete' && (
        <AdminModal title="Delete Coupon" onClose={closeModal}>
          <ConfirmDelete name={modal.coupon.code} onConfirm={() => { deleteCoupon(modal.coupon.id); closeModal(); }} onCancel={closeModal} />
        </AdminModal>
      )}
    </div>
  );
}
