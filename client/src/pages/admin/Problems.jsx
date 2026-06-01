import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Search, Plus, Pencil, Trash2, Code2, Lock } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';

const DIFF_BADGE = {
  EASY:   'bg-lime/10 text-lime-dark border border-lime/30',
  MEDIUM: 'bg-accent/10 text-accent border border-accent/30',
  HARD:   'bg-brand-red/10 text-brand-red border border-brand-red/30',
};

const EMPTY = {
  title: '', slug: '', topicId: '', patternId: '', subPatternId: '',
  difficulty: 'MEDIUM', priority: 'MUST_DO', frequency: 'HIGH',
  leetcodeId: '', leetcodeUrl: '', order: '',
  hint: '', intuition: '', timeEstimate: '', revisionPriority: '1',
  tags: '', companies: '', relatedPatterns: '', commonMistakes: '',
  isPro: false,
};

const Field = ({ label, children }) => (
  <div>
    <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">{label}</label>
    {children}
  </div>
);

function ProblemForm({ initial = EMPTY, topics, patterns, subPatterns, onSave, onCancel }) {
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



  const inputCls = "w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] focus:outline-none focus:border-ink transition-all";

  return (
    <div className="space-y-4">
      <Field label="Title *">
        <input value={form.title} onChange={e => handleTitle(e.target.value)} placeholder="e.g. Two Sum" className={inputCls} />
      </Field>
      <Field label="Slug *">
        <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. two-sum" className={`${inputCls} font-mono`} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Topic *">
          <select value={form.topicId} onChange={e => { set('topicId', e.target.value); set('patternId', ''); set('subPatternId', ''); }} className={inputCls}>
            <option value="">Select topic...</option>
            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
        <Field label="Pattern">
          <select value={form.patternId} onChange={e => { set('patternId', e.target.value); set('subPatternId', ''); }} className={inputCls} disabled={!form.topicId}>
            <option value="">None</option>
            {filteredPatterns.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="Sub-Pattern">
          <select value={form.subPatternId} onChange={e => set('subPatternId', e.target.value)} className={inputCls} disabled={!form.patternId}>
            <option value="">None</option>
            {filteredSubPatterns.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Difficulty">
          <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={inputCls}>
            {['EASY','MEDIUM','HARD'].map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select value={form.priority} onChange={e => set('priority', e.target.value)} className={inputCls}>
            {['MUST_DO','GOOD','OPTIONAL'].map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Frequency">
          <select value={form.frequency} onChange={e => set('frequency', e.target.value)} className={inputCls}>
            {['LOW','MEDIUM','HIGH','VERY_HIGH'].map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="LeetCode ID">
          <input type="number" value={form.leetcodeId} onChange={e => set('leetcodeId', e.target.value)} placeholder="e.g. 1" className={`${inputCls} font-mono`} />
        </Field>
        <Field label="Time Estimate (mins)">
          <input type="number" value={form.timeEstimate} onChange={e => set('timeEstimate', e.target.value)} placeholder="e.g. 15" className={`${inputCls} font-mono`} />
        </Field>
        <Field label="Revision Priority (1-5)">
          <input type="number" min="1" max="5" value={form.revisionPriority} onChange={e => set('revisionPriority', e.target.value)} placeholder="e.g. 5" className={`${inputCls} font-mono`} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="LeetCode URL">
          <input value={form.leetcodeUrl} onChange={e => set('leetcodeUrl', e.target.value)} placeholder="https://leetcode.com/problems/..." className={inputCls} />
        </Field>
        <Field label="Order">
          <input type="number" value={form.order} onChange={e => set('order', e.target.value)} placeholder="e.g. 1" className={`${inputCls} font-mono`} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Hint">
          <textarea value={form.hint} onChange={e => set('hint', e.target.value)} placeholder="Optional hint..." rows={2} className={`${inputCls} resize-none`} />
        </Field>
        <Field label="Intuition">
          <textarea value={form.intuition} onChange={e => set('intuition', e.target.value)} placeholder="Core intuition..." rows={2} className={`${inputCls} resize-none`} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tags (comma separated)">
          <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="array, sorting" className={inputCls} />
        </Field>
        <Field label="Companies (comma separated)">
          <input value={form.companies} onChange={e => set('companies', e.target.value)} placeholder="Google, Meta" className={inputCls} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Related Patterns (comma separated)">
          <input value={form.relatedPatterns} onChange={e => set('relatedPatterns', e.target.value)} placeholder="two-pointer, sliding-window" className={inputCls} />
        </Field>
        <Field label="Common Mistakes (pipe separated)">
          <input value={form.commonMistakes} onChange={e => set('commonMistakes', e.target.value)} placeholder="Off-by-one | Forgetting base case" className={inputCls} />
        </Field>
      </div>
      <div className="flex items-center gap-2 p-3 rounded-[4px] border border-rule bg-cream/50">
        <input type="checkbox" id="isPro" checked={form.isPro} onChange={e => set('isPro', e.target.checked)} className="w-4 h-4 accent-ink" />
        <label htmlFor="isPro" className="font-sans text-[13px] text-ink cursor-pointer flex items-center gap-1.5">
          <Lock size={12} className="text-muted" /> PRO only problem
        </label>
      </div>
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
          disabled={!form.title || !form.slug || !form.topicId}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-[4px] py-2 text-[13px] font-semibold hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Save Problem
        </button>
        <button onClick={onCancel} className="px-4 py-2 cursor-pointer rounded-[4px] border border-rule text-muted hover:text-ink text-[13px] transition-all">Cancel</button>
      </div>
    </div>
  );
}

function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-ink">Delete <strong>"{name}"</strong>? This cannot be undone.</p>
      <div className="flex gap-2">
        <button onClick={onConfirm} className="flex-1 cursor-pointer bg-brand-red text-white rounded-[4px] py-2 text-[13px] font-semibold hover:bg-brand-red/90 transition-all">Delete</button>
        <button onClick={onCancel} className="px-4 py-2 cursor-pointer rounded-[4px] border border-rule text-muted hover:text-ink text-[13px] transition-all">Cancel</button>
      </div>
    </div>
  );
}

export default function Problems() {
  const { topics, patterns, subPatterns, problems, addProblem, updateProblem, deleteProblem } = useAdmin();
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('ALL');
  const [modal, setModal] = useState(null);

  const filtered = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === 'ALL' || p.difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  const closeModal = () => setModal(null);
  const handleSave = (form) => {
    if (modal.type === 'add') addProblem(form);
    else updateProblem(modal.problem.id, form);
    closeModal();
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 pb-10">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Content</p>
          </div>
          <h1 className="font-serif text-[28px] font-black text-ink">Problems</h1>
          <p className="text-muted text-sm mt-1">{problems.length} problems in the system</p>
        </div>
        <button onClick={() => setModal({ type: 'add' })} className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-4 py-2 rounded-[4px] text-[13px] font-semibold hover:bg-ink/90 transition-all shadow-sm">
          <Plus size={14} /> Add Problem
        </button>
      </div>

      <div className="bg-white border border-rule rounded-[4px] shadow-sm">
        <div className="p-6 border-b border-rule flex items-center gap-4 flex-wrap">
          <div className="relative group flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
            <input type="text" placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} className="bg-cream-dark/50 border border-rule/50 rounded-[4px] pl-9 pr-4 py-1.5 text-[12px] w-full focus:outline-none focus:border-ink focus:bg-white transition-all placeholder:text-muted/60" />
          </div>
          <div className="flex gap-1">
            {['ALL','EASY','MEDIUM','HARD'].map(d => (
              <button key={d} onClick={() => setDiffFilter(d)} className={`px-3 py-1.5 cursor-pointer rounded-[4px] font-mono text-[10px] uppercase tracking-widest transition-all ${diffFilter === d ? 'bg-ink text-cream' : 'bg-cream text-muted border border-rule hover:text-ink'}`}>{d}</button>
            ))}
          </div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest">{filtered.length} results</p>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule">
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">#</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Title</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Topic</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Difficulty</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Pro</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Solves</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className="border-b border-rule/60 last:border-0 hover:bg-cream/50 transition-colors group">
                <td className="px-6 py-4 font-mono text-[11px] text-muted/60">{i + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Code2 size={13} className="text-muted shrink-0" />
                    <span className="font-sans text-[13px] font-semibold text-ink">{p.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[12px] text-muted">{p.topic}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-[4px] uppercase tracking-wider ${DIFF_BADGE[p.difficulty]}`}>{p.difficulty}</span>
                </td>
                <td className="px-6 py-4">
                  {p.isPro && <span className="flex items-center gap-1 font-mono text-[9px] bg-ink text-lime px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider w-fit"><Lock size={8} />Pro</span>}
                </td>
                <td className="px-6 py-4 text-right font-mono text-[12px] font-bold text-ink">{p.solved?.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal({ type: 'edit', problem: p })} className="p-1.5 cursor-pointer rounded-[4px] text-muted hover:text-ink hover:bg-cream-dark transition-all"><Pencil size={13} /></button>
                    <button onClick={() => setModal({ type: 'delete', problem: p })} className="p-1.5 cursor-pointer rounded-[4px] text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center"><p className="font-mono text-[11px] text-muted uppercase tracking-widest">No problems found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal?.type === 'add' && (
        <AdminModal title="Add Problem" onClose={closeModal} width="max-w-3xl">
          <ProblemForm topics={topics} patterns={patterns} subPatterns={subPatterns} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'edit' && (
        <AdminModal title="Edit Problem" onClose={closeModal} width="max-w-3xl">
          <ProblemForm initial={modal.problem} topics={topics} patterns={patterns} subPatterns={subPatterns} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'delete' && (
        <AdminModal title="Delete Problem" onClose={closeModal}>
          <ConfirmDelete name={modal.problem.title} onConfirm={() => { deleteProblem(modal.problem.id); closeModal(); }} onCancel={closeModal} />
        </AdminModal>
      )}
    </div>
  );
}
