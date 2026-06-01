import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Search, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';

const EMPTY = { code: '', discountType: 'PERCENTAGE', discountValue: '', expiryDate: '', maxUses: '', isActive: true };

function CouponForm({ initial = EMPTY, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Coupon Code *</label>
        <input
          value={form.code}
          onChange={e => set('code', e.target.value.toUpperCase())}
          placeholder="e.g. LAUNCH20"
          className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] font-mono uppercase focus:outline-none focus:border-ink transition-all"
        />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Discount Type</label>
        <div className="flex gap-2">
          {['PERCENTAGE', 'FLAT'].map(t => (
            <button key={t} onClick={() => set('discountType', t)} type="button"
              className={`flex-1 cursor-pointer py-2 rounded-[4px] font-mono text-[10px] uppercase tracking-widest border transition-all ${form.discountType === t ? 'bg-ink text-cream border-ink' : 'bg-cream text-muted border-rule hover:text-ink'}`}>
              {t === 'PERCENTAGE' ? '% Percentage' : '₹ Flat'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">
          Discount Value * {form.discountType === 'PERCENTAGE' ? '(%)' : '(₹ in paise e.g. 1000 = ₹10)'}
        </label>
        <input
          type="number"
          value={form.discountValue}
          onChange={e => set('discountValue', e.target.value)}
          placeholder={form.discountType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 10000'}
          className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-ink transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Expiry Date</label>
          <input
            type="date"
            value={form.expiryDate || ''}
            onChange={e => set('expiryDate', e.target.value)}
            className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-ink transition-all"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Max Uses</label>
          <input
            type="number"
            value={form.maxUses || ''}
            onChange={e => set('maxUses', e.target.value)}
            placeholder="Leave blank = unlimited"
            className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-ink transition-all"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave({ ...form, discountValue: Number(form.discountValue), maxUses: form.maxUses ? Number(form.maxUses) : null })}
          disabled={!form.code || !form.discountValue}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-[4px] py-2 text-[13px] font-semibold hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >Save Coupon</button>
        <button onClick={onCancel} className="px-4 py-2 cursor-pointer rounded-[4px] border border-rule text-muted hover:text-ink text-[13px] transition-all">Cancel</button>
      </div>
    </div>
  );
}

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-ink">Delete coupon <strong>"{name}"</strong>? This cannot be undone.</p>
      <div className="flex gap-2">
        <button onClick={onConfirm} className="flex-1 cursor-pointer bg-brand-red text-white rounded-[4px] py-2 text-[13px] font-semibold">Delete</button>
        <button onClick={onCancel} className="px-4 py-2 cursor-pointer rounded-[4px] border border-rule text-muted hover:text-ink text-[13px]">Cancel</button>
      </div>
    </div>
  );
}

export default function Coupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useAdmin();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const filtered = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));
  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.type === 'add') addCoupon(form);
    else updateCoupon(modal.coupon.id, form);
    closeModal();
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 pb-10">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Promotions</p>
          </div>
          <h1 className="font-serif text-[28px] font-black text-ink">Coupons</h1>
          <p className="text-muted text-sm mt-1">{coupons.length} coupon codes in the system</p>
        </div>
        <button onClick={() => setModal({ type: 'add' })} className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-4 py-2 rounded-[4px] text-[13px] font-semibold hover:bg-ink/90 transition-all shadow-sm">
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      <div className="bg-white border border-rule rounded-[4px] shadow-sm">
        <div className="p-6 border-b border-rule flex items-center justify-between">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
            <input type="text" placeholder="Search coupons..." value={search} onChange={e => setSearch(e.target.value)} className="bg-cream-dark/50 border border-rule/50 rounded-[4px] pl-9 pr-4 py-1.5 text-[12px] w-[260px] focus:outline-none focus:border-ink focus:bg-white transition-all placeholder:text-muted/60" />
          </div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest">{filtered.length} results</p>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule">
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Code</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Discount</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Usage</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Expiry</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Status</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-rule/60 last:border-0 hover:bg-cream/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-muted shrink-0" />
                    <code className="font-mono text-[13px] font-bold text-ink">{c.code}</code>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-[13px] font-bold text-ink">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                  </span>
                  <span className="font-mono text-[9px] text-muted ml-1 uppercase">{c.discountType}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-ink">{c.usedCount}</span>
                    <span className="text-muted/40">/</span>
                    <span className="font-mono text-[12px] text-muted">{c.maxUses ?? '∞'}</span>
                  </div>
                  {c.maxUses && (
                    <div className="h-1 w-20 bg-cream rounded-full mt-1 overflow-hidden border border-rule/60">
                      <div className="h-full bg-ink rounded-full" style={{ width: `${Math.min(100, (c.usedCount / c.maxUses) * 100)}%` }} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-[11px] text-muted">{c.expiryDate || '—'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleCoupon(c.id)} className="flex items-center cursor-pointer gap-1.5 transition-all">
                    {c.isActive
                      ? <><ToggleRight size={20} className="text-lime-dark" /><span className="font-mono text-[10px] text-lime-dark uppercase tracking-wider">Active</span></>
                      : <><ToggleLeft size={20} className="text-muted" /><span className="font-mono text-[10px] text-muted uppercase tracking-wider">Inactive</span></>
                    }
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal({ type: 'edit', coupon: c })} className="p-1.5 cursor-pointer rounded-[4px] text-muted hover:text-ink hover:bg-cream-dark transition-all"><Pencil size={13} /></button>
                    <button onClick={() => setModal({ type: 'delete', coupon: c })} className="p-1.5 cursor-pointer rounded-[4px] text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center"><p className="font-mono text-[11px] text-muted uppercase tracking-widest">No coupons found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

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
