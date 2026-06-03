import React, { useState } from 'react';
import { Tag, Calendar, Users, Percent, IndianRupee } from 'lucide-react';

const EMPTY = { code: '', discountType: 'PERCENTAGE', discountValue: '', expiryDate: '', maxUses: '', isActive: true };

const Field = ({ label, icon: Icon, children, hint }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5">
      {Icon && <Icon size={11} className="text-muted" />}
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</label>
    </div>
    {children}
    {hint && <p className="font-mono text-[9px] text-muted/60">{hint}</p>}
  </div>
);

export default function CouponForm({ initial = EMPTY, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputCls = `w-full bg-cream-dark/40 border border-rule/60 rounded-xl px-3.5 py-2.5 text-[13px]
    focus:outline-none focus:border-ink focus:bg-white focus:shadow-sm transition-all placeholder:text-muted/40`;

  const isValid = form.code.trim() && form.discountValue;

  return (
    <div className="space-y-5">
      
      {/* Live preview */}
      {form.code && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-ink/5 border border-rule/40">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center shrink-0">
            <Tag size={14} className="text-lime" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-mono text-[14px] font-bold text-ink truncate">{form.code}</p>
              {form.discountValue && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-md border text-lime-dark bg-lime/10 border-lime/30 shrink-0">
                  {form.discountType === 'PERCENTAGE' ? `${form.discountValue}% OFF` : `₹${form.discountValue} OFF`}
                </span>
              )}
            </div>
            <p className="font-mono text-[10px] text-muted truncate">
              {form.maxUses ? `Max ${form.maxUses} uses` : 'Unlimited uses'}
              {form.expiryDate ? ` • Expires ${form.expiryDate}` : ' • No expiry'}
            </p>
          </div>
        </div>
      )}

      {/* Code */}
      <Field label="Coupon Code *" icon={Tag}>
        <input
          value={form.code}
          onChange={e => set('code', e.target.value.toUpperCase().replace(/\s+/g, ''))}
          placeholder="e.g. LAUNCH20"
          autoFocus
          className={`${inputCls} font-mono uppercase font-bold text-ink`}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        {/* Discount Type */}
        <Field label="Type" icon={Tag}>
          <div className="flex gap-2 p-1 bg-cream-dark/40 border border-rule/60 rounded-xl">
            {[
              { id: 'PERCENTAGE', label: '% Percent', icon: Percent },
              { id: 'FLAT', label: '₹ Flat', icon: IndianRupee },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => set('discountType', t.id)}
                type="button"
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all
                  ${form.discountType === t.id ? 'bg-ink text-cream shadow-sm' : 'text-muted hover:text-ink hover:bg-white'}`}
              >
                <t.icon size={10} /> {t.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Discount Value */}
        <Field 
          label={`Discount Value *`} 
          icon={form.discountType === 'PERCENTAGE' ? Percent : IndianRupee}
          hint={form.discountType === 'PERCENTAGE' ? '0-100%' : 'Value in rupees (e.g. 500 = ₹500)'}
        >
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[12px] text-muted/50">
              {form.discountType === 'PERCENTAGE' ? '%' : '₹'}
            </span>
            <input
              type="number"
              value={form.discountValue}
              onChange={e => set('discountValue', e.target.value)}
              placeholder={form.discountType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 500'}
              className={`${inputCls} pl-8 font-mono`}
            />
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Expiry Date" icon={Calendar} hint="Optional">
          <input
            type="date"
            value={form.expiryDate || ''}
            onChange={e => set('expiryDate', e.target.value)}
            className={`${inputCls} font-mono`}
          />
        </Field>
        
        <Field label="Max Uses" icon={Users} hint="Leave blank for unlimited">
          <input
            type="number"
            value={form.maxUses || ''}
            onChange={e => set('maxUses', e.target.value)}
            placeholder="e.g. 100"
            className={`${inputCls} font-mono`}
          />
        </Field>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave({ 
            ...form, 
            discountValue: Number(form.discountValue), 
            maxUses: form.maxUses ? Number(form.maxUses) : null 
          })}
          disabled={!isValid}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-xl py-3 text-[14px] font-semibold hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {initial.id ? 'Save Changes' : 'Create Coupon'}
        </button>
        <button 
          onClick={onCancel} 
          className="px-6 py-3 cursor-pointer rounded-xl border border-rule text-muted hover:text-ink hover:border-ink/30 text-[14px] font-semibold transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
