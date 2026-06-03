import React, { useState } from 'react';
import { Lock, Code2, Link2, Folder, Layers, Network, Hash, Link as UrlIcon, Lightbulb, Brain, Tags, Building2, Share2, AlertTriangle, Clock } from 'lucide-react';

const EMPTY = {
  title: '', slug: '', topicId: '', patternId: '', subPatternId: '',
  difficulty: 'MEDIUM', priority: 'MUST_DO', frequency: 'HIGH',
  leetcodeId: '', leetcodeUrl: '', order: '',
  hint: '', intuition: '', timeEstimate: '', revisionPriority: '1',
  tags: '', companies: '', relatedPatterns: '', commonMistakes: '',
  isPro: false,
};

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

export default function ProblemForm({ initial = EMPTY, topics, patterns, subPatterns, onSave, onCancel }) {
  const [form, setForm] = useState({
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || ''),
    companies: Array.isArray(initial.companies) ? initial.companies.join(', ') : (initial.companies || ''),
    relatedPatterns: Array.isArray(initial.relatedPatterns) ? initial.relatedPatterns.join(', ') : (initial.relatedPatterns || ''),
    commonMistakes: Array.isArray(initial.commonMistakes) ? initial.commonMistakes.join(' | ') : (initial.commonMistakes || ''),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTitle = (v) => {
    set('title', v);
    if (!initial.id) set('slug', v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const filteredPatterns = patterns.filter(p => !form.topicId || p.topicId === form.topicId);
  const filteredSubPatterns = subPatterns.filter(sp => !form.patternId || sp.patternId === form.patternId);
  
  const isValid = form.title.trim() && form.slug.trim() && form.topicId;

  const inputCls = `w-full bg-cream-dark/40 border border-rule/60 rounded-xl px-3.5 py-2.5 text-[13px]
    focus:outline-none focus:border-ink focus:bg-white focus:shadow-sm transition-all placeholder:text-muted/40`;

  return (
    <div className="space-y-6">

      {/* Live preview */}
      {form.title && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-ink/5 border border-rule/40">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center shrink-0">
            <Code2 size={14} className="text-lime" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-sans text-[13px] font-bold text-ink truncate">{form.title}</p>
              {form.difficulty && (
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-md border shrink-0 ${
                  form.difficulty === 'EASY' ? 'text-lime-dark bg-lime/10 border-lime/30' :
                  form.difficulty === 'MEDIUM' ? 'text-orange-700 bg-accent/10 border-accent/30' :
                  'text-brand-red bg-brand-red/10 border-brand-red/30'
                }`}>
                  {form.difficulty}
                </span>
              )}
              {form.isPro && (
                <span className="flex items-center gap-0.5 font-mono text-[9px] bg-ink text-lime border border-ink px-1.5 py-0.5 rounded-md shrink-0">
                  <Lock size={8} /> PRO
                </span>
              )}
            </div>
            <p className="font-mono text-[10px] text-muted truncate">/{form.slug || '…'}</p>
          </div>
        </div>
      )}

      {/* ── Section: Basics ───────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title *" icon={Code2}>
            <input value={form.title} onChange={e => handleTitle(e.target.value)} placeholder="e.g. Two Sum" autoFocus className={inputCls} />
          </Field>
          <Field label="Slug *" icon={Link2}>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[12px] text-muted/50">/</span>
              <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="two-sum" className={`${inputCls} pl-6 font-mono`} />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Topic *" icon={Folder}>
            <select value={form.topicId} onChange={e => { set('topicId', e.target.value); set('patternId', ''); set('subPatternId', ''); }} className={inputCls}>
              <option value="">Select topic...</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
          <Field label="Pattern" icon={Layers}>
            <select value={form.patternId} onChange={e => { set('patternId', e.target.value); set('subPatternId', ''); }} className={inputCls} disabled={!form.topicId}>
              <option value="">None</option>
              {filteredPatterns.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Sub-Pattern" icon={Network}>
            <select value={form.subPatternId} onChange={e => set('subPatternId', e.target.value)} className={inputCls} disabled={!form.patternId}>
              <option value="">None</option>
              {filteredSubPatterns.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <hr className="border-t border-rule/40" />

      {/* ── Section: Metadata ────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Difficulty">
            <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={inputCls}>
              {['EASY','MEDIUM','HARD'].map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select value={form.priority} onChange={e => set('priority', e.target.value)} className={inputCls}>
              {['MUST_DO','GOOD','OPTIONAL'].map(p => <option key={p}>{p.replace('_', ' ')}</option>)}
            </select>
          </Field>
          <Field label="Frequency">
            <select value={form.frequency} onChange={e => set('frequency', e.target.value)} className={inputCls}>
              {['LOW','MEDIUM','HIGH','VERY_HIGH'].map(f => <option key={f}>{f.replace('_', ' ')}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="LeetCode ID" icon={Hash}>
            <input type="number" value={form.leetcodeId} onChange={e => set('leetcodeId', e.target.value)} placeholder="e.g. 1" className={`${inputCls} font-mono`} />
          </Field>
          <Field label="LeetCode URL" icon={UrlIcon}>
            <input value={form.leetcodeUrl} onChange={e => set('leetcodeUrl', e.target.value)} placeholder="https://leetcode.com/problems/..." className={inputCls} />
          </Field>
          <Field label="Order" icon={Hash}>
            <input type="number" value={form.order} onChange={e => set('order', e.target.value)} placeholder="e.g. 1" className={`${inputCls} font-mono`} />
          </Field>
        </div>
      </div>

      <hr className="border-t border-rule/40" />

      {/* ── Section: Content & Tags ──────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Intuition" icon={Brain}>
            <textarea value={form.intuition} onChange={e => set('intuition', e.target.value)} placeholder="Core intuition..." rows={2} className={`${inputCls} resize-none`} />
          </Field>
          <Field label="Hint" icon={Lightbulb}>
            <textarea value={form.hint} onChange={e => set('hint', e.target.value)} placeholder="Optional hint..." rows={2} className={`${inputCls} resize-none`} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Tags" icon={Tags} hint="Comma separated">
            <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="array, sorting" className={inputCls} />
          </Field>
          <Field label="Companies" icon={Building2} hint="Comma separated">
            <input value={form.companies} onChange={e => set('companies', e.target.value)} placeholder="Google, Meta" className={inputCls} />
          </Field>
          <Field label="Related Patterns" icon={Share2} hint="Comma separated slugs">
            <input value={form.relatedPatterns} onChange={e => set('relatedPatterns', e.target.value)} placeholder="two-pointer, sliding-window" className={inputCls} />
          </Field>
          <Field label="Common Mistakes" icon={AlertTriangle} hint="Pipe (|) separated">
            <input value={form.commonMistakes} onChange={e => set('commonMistakes', e.target.value)} placeholder="Off-by-one | Forgetting base case" className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Time Estimate" icon={Clock} hint="In minutes">
            <input type="number" value={form.timeEstimate} onChange={e => set('timeEstimate', e.target.value)} placeholder="e.g. 15" className={`${inputCls} font-mono`} />
          </Field>
          <Field label="Revision Priority" icon={Hash} hint="Score from 1 to 5">
            <input type="number" min="1" max="5" value={form.revisionPriority} onChange={e => set('revisionPriority', e.target.value)} placeholder="e.g. 5" className={`${inputCls} font-mono`} />
          </Field>
        </div>
      </div>

      {/* ── Section: Premium ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-ink/10 bg-ink/5">
        <input type="checkbox" id="isPro" checked={form.isPro} onChange={e => set('isPro', e.target.checked)} className="w-4 h-4 accent-ink cursor-pointer rounded-sm" />
        <label htmlFor="isPro" className="font-sans text-[14px] font-bold text-ink cursor-pointer flex items-center gap-2 select-none">
          <div className="w-6 h-6 rounded-md bg-ink flex items-center justify-center shrink-0">
            <Lock size={12} className="text-lime" />
          </div>
          Requires PRO subscription
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave({
            ...form,
            topic: topics.find(t => t.id === form.topicId)?.name || '',
            pattern: patterns.find(p => p.id === form.patternId)?.name || null,
            subPattern: subPatterns.find(sp => sp.id === form.subPatternId)?.name || null,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            companies: form.companies.split(',').map(c => c.trim()).filter(Boolean),
            relatedPatterns: form.relatedPatterns.split(',').map(p => p.trim()).filter(Boolean),
            commonMistakes: form.commonMistakes.split('|').map(m => m.trim()).filter(Boolean),
            leetcodeId: form.leetcodeId ? Number(form.leetcodeId) : null,
            timeEstimate: form.timeEstimate ? Number(form.timeEstimate) : null,
            revisionPriority: form.revisionPriority ? Number(form.revisionPriority) : 1,
            order: Number(form.order) || 1,
          })}
          disabled={!isValid}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-xl py-3 text-[14px] font-semibold hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {initial.id ? 'Save Changes' : 'Create Problem'}
        </button>
        <button onClick={onCancel} className="px-6 py-3 cursor-pointer rounded-xl border border-rule text-muted hover:text-ink hover:border-ink/30 text-[14px] font-semibold transition-all">
          Cancel
        </button>
      </div>
    </div>
  );
}
