import React, { useState } from 'react';
import { Network, Link2, Share2 } from 'lucide-react';
import CustomSelect from '../../../components/ui/CustomSelect';

const EMPTY = { name: '', slug: '', patternId: '' };

export default function SubPatternForm({ initial = EMPTY, patterns, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleName = (v) => {
    set('name', v);
    if (!initial.id) set('slug', v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const isValid = form.name.trim() && form.slug.trim() && form.patternId;
  const selectedPattern = patterns.find(p => p.id === form.patternId);

  const inputCls = `w-full bg-cream-dark/40 border border-rule/60 rounded-xl px-3.5 py-2.5 text-[13px]
    focus:outline-none focus:border-ink focus:bg-white focus:shadow-sm transition-all placeholder:text-muted/40`;

  return (
    <div className="space-y-5">

      {/* Live preview */}
      {form.name && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-ink/5 border border-rule/40">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center shrink-0">
            <Share2 size={14} className="text-lime" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-sans text-[13px] font-bold text-ink truncate">{form.name}</p>
              {selectedPattern && (
                <span className="font-mono text-[9px] text-muted bg-cream px-1.5 py-0.5 rounded-md border border-rule shrink-0">
                  {selectedPattern.name}
                </span>
              )}
            </div>
            <p className="font-mono text-[10px] text-muted">/{form.slug || '…'}</p>
          </div>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Share2 size={11} className="text-muted" />
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted">Sub-Pattern Name *</label>
        </div>
        <input
          value={form.name}
          onChange={e => handleName(e.target.value)}
          placeholder="e.g. Opposite Direction"
          autoFocus
          className={inputCls}
        />
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Link2 size={11} className="text-muted" />
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted">Slug *</label>
        </div>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[12px] text-muted/50">/</span>
          <input
            value={form.slug}
            onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="opposite-direction"
            className={`${inputCls} pl-6 font-mono`}
          />
        </div>
      </div>

      {/* Parent Pattern */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Network size={11} className="text-muted" />
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted">Parent Pattern *</label>
        </div>
        <CustomSelect
          value={form.patternId}
          onChange={val => set('patternId', val)}
          className={inputCls}
          placeholder="Select a pattern…"
          options={patterns.map(p => ({ value: p.id, label: p.name }))}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave({ ...form, pattern: patterns.find(p => p.id === form.patternId)?.name || '' })}
          disabled={!isValid}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-xl py-2.5 text-[13px] font-semibold hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {initial.id ? 'Save Changes' : 'Create Sub-Pattern'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 cursor-pointer rounded-xl border border-rule text-muted hover:text-ink hover:border-ink/30 text-[13px] transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
