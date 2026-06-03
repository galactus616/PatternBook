import React, { useState } from 'react';
import { Layers, Link2, BookOpen } from 'lucide-react';

const EMPTY = { name: '', slug: '', topicId: '', difficulty: 'MEDIUM' };

const DIFF_CONFIG = {
  EASY:   { label: 'Easy',   color: 'bg-lime text-lime-dark border-lime/40',         active: 'bg-lime border-lime' },
  MEDIUM: { label: 'Medium', color: 'bg-accent/10 text-orange-700 border-accent/30', active: 'bg-accent border-accent text-white' },
  HARD:   { label: 'Hard',   color: 'bg-brand-red/10 text-brand-red border-brand-red/30', active: 'bg-brand-red border-brand-red text-white' },
};

export default function PatternForm({ initial = EMPTY, topics, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleName = (v) => {
    set('name', v);
    if (!initial.id) set('slug', v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const isValid = form.name.trim() && form.slug.trim() && form.topicId;
  const selectedTopic = topics.find(t => t.id === form.topicId);

  const inputCls = `w-full bg-cream-dark/40 border border-rule/60 rounded-xl px-3.5 py-2.5 text-[13px]
    focus:outline-none focus:border-ink focus:bg-white focus:shadow-sm transition-all placeholder:text-muted/40`;

  return (
    <div className="space-y-5">

      {/* Live preview */}
      {form.name && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-ink/5 border border-rule/40">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center shrink-0">
            <Layers size={14} className="text-lime" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-sans text-[13px] font-bold text-ink truncate">{form.name}</p>
              {selectedTopic && (
                <span className="font-mono text-[9px] text-muted bg-cream px-1.5 py-0.5 rounded-md border border-rule shrink-0">
                  {selectedTopic.name}
                </span>
              )}
              {form.difficulty && (
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-md border shrink-0 ${
                  form.difficulty === 'EASY' ? 'text-lime-dark bg-lime/10 border-lime/30' :
                  form.difficulty === 'MEDIUM' ? 'text-orange-700 bg-accent/10 border-accent/30' :
                  'text-brand-red bg-brand-red/10 border-brand-red/30'
                }`}>
                  {form.difficulty}
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
          <Layers size={11} className="text-muted" />
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted">Pattern Name *</label>
        </div>
        <input
          value={form.name}
          onChange={e => handleName(e.target.value)}
          placeholder="e.g. Two Pointers"
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
            placeholder="two-pointers"
            className={`${inputCls} pl-6 font-mono`}
          />
        </div>
      </div>

      {/* Topic */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <BookOpen size={11} className="text-muted" />
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted">Topic *</label>
        </div>
        <select
          value={form.topicId}
          onChange={e => set('topicId', e.target.value)}
          className={inputCls}
        >
          <option value="">Select a topic…</option>
          {topics.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Difficulty toggle */}
      <div className="space-y-1.5">
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block">Difficulty</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(DIFF_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              onClick={() => set('difficulty', key)}
              className={`py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-widest border transition-all cursor-pointer
                ${form.difficulty === key ? cfg.active : 'bg-cream text-muted border-rule hover:border-ink/30 hover:text-ink'}`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave({ ...form, topic: topics.find(t => t.id === form.topicId)?.name || '' })}
          disabled={!isValid}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-xl py-2.5 text-[13px] font-semibold hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {initial.id ? 'Save Changes' : 'Create Pattern'}
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
