import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Layers, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';

const DIFF_BADGE = {
  EASY:   'bg-lime/10 text-lime-dark border border-lime/30',
  MEDIUM: 'bg-accent/10 text-accent border border-accent/30',
  HARD:   'bg-brand-red/10 text-brand-red border border-brand-red/30',
};

const EMPTY = { name: '', slug: '', topicId: '', difficulty: 'MEDIUM' };

function PatternForm({ initial = EMPTY, topics, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleName = (v) => {
    set('name', v);
    if (!initial.id) set('slug', v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Pattern Name *</label>
        <input
          value={form.name}
          onChange={e => handleName(e.target.value)}
          placeholder="e.g. Two Pointer"
          className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] focus:outline-none focus:border-ink transition-all"
        />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Slug *</label>
        <input
          value={form.slug}
          onChange={e => set('slug', e.target.value)}
          placeholder="e.g. two-pointer"
          className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-ink transition-all"
        />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Topic *</label>
        <select
          value={form.topicId}
          onChange={e => set('topicId', e.target.value)}
          className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] focus:outline-none focus:border-ink transition-all"
        >
          <option value="">Select topic...</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Difficulty</label>
        <div className="flex gap-2">
          {['EASY', 'MEDIUM', 'HARD'].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => set('difficulty', d)}
              className={`flex-1 cursor-pointer py-2 rounded-[4px] font-mono text-[10px] uppercase tracking-widest border transition-all ${
                form.difficulty === d ? 'bg-ink text-cream border-ink' : 'bg-cream text-muted border-rule hover:text-ink'
              }`}
            >{d}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave({ ...form, topic: topics.find(t => t.id === form.topicId)?.name || '' })}
          disabled={!form.name || !form.slug || !form.topicId}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-[4px] py-2 text-[13px] font-semibold hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Save Pattern
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

export default function Patterns() {
  const { topics, patterns, addPattern, updatePattern, deletePattern } = useAdmin();
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('ALL');
  const [modal, setModal] = useState(null);

  const filtered = patterns.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase());
    const matchDiff   = diffFilter === 'ALL' || p.difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.type === 'add') addPattern(form);
    else updatePattern(modal.pattern.id, form);
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
          <h1 className="font-serif text-[28px] font-black text-ink">Patterns</h1>
          <p className="text-muted text-sm mt-1">{patterns.length} patterns across all topics</p>
        </div>
        <button
          onClick={() => setModal({ type: 'add' })}
          className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-4 py-2 rounded-[4px] text-[13px] font-semibold hover:bg-ink/90 transition-all shadow-sm"
        >
          <Plus size={14} /> Add Pattern
        </button>
      </div>

      <div className="bg-white border border-rule rounded-[4px] shadow-sm">
        <div className="p-6 border-b border-rule flex items-center gap-4 flex-wrap">
          <div className="relative group flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
            <input
              type="text"
              placeholder="Search patterns..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-cream-dark/50 border border-rule/50 rounded-[4px] pl-9 pr-4 py-1.5 text-[12px] w-full focus:outline-none focus:border-ink focus:bg-white transition-all placeholder:text-muted/60"
            />
          </div>
          <div className="flex gap-1">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(d => (
              <button key={d} onClick={() => setDiffFilter(d)} className={`px-3 py-1.5 cursor-pointer rounded-[4px] font-mono text-[10px] uppercase tracking-widest transition-all duration-150 ${diffFilter === d ? 'bg-ink text-cream' : 'bg-cream text-muted border border-rule hover:text-ink'}`}>{d}</button>
            ))}
          </div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest">{filtered.length} results</p>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule">
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Pattern</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Topic</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Difficulty</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Problems</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-rule/60 last:border-0 hover:bg-cream/50 transition-colors duration-150 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[4px] bg-cream border border-rule flex items-center justify-center shrink-0">
                      <Layers size={13} className="text-muted" />
                    </div>
                    <span className="font-sans text-[13px] font-semibold text-ink">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted text-[12px]">{p.topic}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-[4px] uppercase tracking-wider ${DIFF_BADGE[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-[13px] font-bold text-ink">{p.problemCount}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal({ type: 'edit', pattern: p })} className="p-1.5 cursor-pointer rounded-[4px] text-muted hover:text-ink hover:bg-cream-dark transition-all" title="Edit"><Pencil size={13} /></button>
                    <button onClick={() => setModal({ type: 'delete', pattern: p })} className="p-1.5 cursor-pointer rounded-[4px] text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all" title="Delete"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center"><p className="font-mono text-[11px] text-muted uppercase tracking-widest">No patterns found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal?.type === 'add' && (
        <AdminModal title="Add Pattern" onClose={closeModal}>
          <PatternForm topics={topics} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'edit' && (
        <AdminModal title="Edit Pattern" onClose={closeModal}>
          <PatternForm initial={modal.pattern} topics={topics} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'delete' && (
        <AdminModal title="Delete Pattern" onClose={closeModal}>
          <ConfirmDelete name={modal.pattern.name} onConfirm={() => { deletePattern(modal.pattern.id); closeModal(); }} onCancel={closeModal} />
        </AdminModal>
      )}
    </div>
  );
}
