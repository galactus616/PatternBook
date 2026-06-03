import React, { useState } from 'react';
import { BookOpen, Hash, Link2 } from 'lucide-react';

const EMPTY = { name: '', slug: '', order: '' };

function Field({ label, icon: Icon, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={11} className="text-muted" />}
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</label>
      </div>
      {children}
      {hint && <p className="font-mono text-[9px] text-muted/60">{hint}</p>}
    </div>
  );
}

export default function TopicForm({ initial = EMPTY, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleName = (v) => {
    set('name', v);
    // auto-slug only when creating, not editing
    if (!initial.id) set('slug', v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const isValid = form.name.trim() && form.slug.trim();

  const inputCls = `w-full bg-cream-dark/40 border border-rule/60 rounded-xl px-3.5 py-2.5 text-[13px]
    focus:outline-none focus:border-ink focus:bg-white focus:shadow-sm transition-all placeholder:text-muted/40`;

  return (
    <div className="space-y-5">

      {/* Preview badge */}
      {form.name && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-ink/5 border border-rule/40">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center shrink-0">
            <BookOpen size={14} className="text-lime" />
          </div>
          <div className="min-w-0">
            <p className="font-sans text-[13px] font-bold text-ink truncate">{form.name || 'Topic Name'}</p>
            <p className="font-mono text-[10px] text-muted truncate">/{form.slug || 'slug'}</p>
          </div>
        </div>
      )}

      <Field label="Topic Name *" icon={BookOpen} hint="Shown to users in the learning path">
        <input
          value={form.name}
          onChange={e => handleName(e.target.value)}
          placeholder="e.g. Arrays & Hashing"
          autoFocus
          className={inputCls}
        />
      </Field>

      <Field label="Slug *" icon={Link2} hint="Used in the URL — auto-generated from name">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[12px] text-muted/50">/</span>
          <input
            value={form.slug}
            onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="arrays-hashing"
            className={`${inputCls} pl-6 font-mono`}
          />
        </div>
      </Field>

      <Field label="Display Order" icon={Hash} hint="Lower number = shown first">
        <input
          type="number"
          value={form.order}
          onChange={e => set('order', e.target.value)}
          placeholder="e.g. 1"
          min="1"
          className={`${inputCls} font-mono`}
        />
      </Field>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={!isValid}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-xl py-2.5 text-[13px] font-semibold hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {initial.id ? 'Save Changes' : 'Create Topic'}
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
