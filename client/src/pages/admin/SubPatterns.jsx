import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Network, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';

const EMPTY = { name: '', slug: '', patternId: '' };

function SubPatternForm({ initial = EMPTY, patterns, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleName = (v) => {
    set('name', v);
    if (!initial.id) set('slug', v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Sub-Pattern Name *</label>
        <input
          value={form.name}
          onChange={e => handleName(e.target.value)}
          placeholder="e.g. Opposite Direction"
          className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] focus:outline-none focus:border-ink transition-all"
        />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Slug *</label>
        <input
          value={form.slug}
          onChange={e => set('slug', e.target.value)}
          placeholder="e.g. opposite-direction"
          className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-ink transition-all"
        />
      </div>
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-1.5">Parent Pattern *</label>
        <select
          value={form.patternId}
          onChange={e => set('patternId', e.target.value)}
          className="w-full bg-cream-dark/50 border border-rule/50 rounded-[4px] px-3 py-2 text-[13px] focus:outline-none focus:border-ink transition-all"
        >
          <option value="">Select pattern...</option>
          {patterns.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onSave({ ...form, pattern: patterns.find(p => p.id === form.patternId)?.name || '' })}
          disabled={!form.name || !form.slug || !form.patternId}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-[4px] py-2 text-[13px] font-semibold hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Save Sub-Pattern
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

export default function SubPatterns() {
  const { patterns, subPatterns, addSubPattern, updateSubPattern, deleteSubPattern } = useAdmin();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const filtered = subPatterns.filter(sp => {
    return sp.name.toLowerCase().includes(search.toLowerCase()) || sp.pattern.toLowerCase().includes(search.toLowerCase());
  });

  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.type === 'add') addSubPattern(form);
    else updateSubPattern(modal.subPattern.id, form);
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
          <h1 className="font-serif text-[28px] font-black text-ink">Sub-Patterns</h1>
          <p className="text-muted text-sm mt-1">{subPatterns.length} sub-patterns</p>
        </div>
        <button
          onClick={() => setModal({ type: 'add' })}
          className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-4 py-2 rounded-[4px] text-[13px] font-semibold hover:bg-ink/90 transition-all shadow-sm"
        >
          <Plus size={14} /> Add Sub-Pattern
        </button>
      </div>

      <div className="bg-white border border-rule rounded-[4px] shadow-sm">
        <div className="p-6 border-b border-rule flex items-center gap-4 flex-wrap">
          <div className="relative group flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
            <input
              type="text"
              placeholder="Search sub-patterns..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-cream-dark/50 border border-rule/50 rounded-[4px] pl-9 pr-4 py-1.5 text-[12px] w-full focus:outline-none focus:border-ink focus:bg-white transition-all placeholder:text-muted/60"
            />
          </div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest">{filtered.length} results</p>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule">
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Sub-Pattern</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Parent Pattern</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Problems</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sp) => (
              <tr key={sp.id} className="border-b border-rule/60 last:border-0 hover:bg-cream/50 transition-colors duration-150 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[4px] bg-cream border border-rule flex items-center justify-center shrink-0">
                      <Network size={13} className="text-muted" />
                    </div>
                    <span className="font-sans text-[13px] font-semibold text-ink">{sp.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted text-[12px]">{sp.pattern}</td>
                <td className="px-6 py-4 text-right font-mono text-[13px] font-bold text-ink">{sp.problemCount}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal({ type: 'edit', subPattern: sp })} className="p-1.5 cursor-pointer rounded-[4px] text-muted hover:text-ink hover:bg-cream-dark transition-all" title="Edit"><Pencil size={13} /></button>
                    <button onClick={() => setModal({ type: 'delete', subPattern: sp })} className="p-1.5 cursor-pointer rounded-[4px] text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all" title="Delete"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center"><p className="font-mono text-[11px] text-muted uppercase tracking-widest">No sub-patterns found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal?.type === 'add' && (
        <AdminModal title="Add Sub-Pattern" onClose={closeModal}>
          <SubPatternForm patterns={patterns} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'edit' && (
        <AdminModal title="Edit Sub-Pattern" onClose={closeModal}>
          <SubPatternForm initial={modal.subPattern} patterns={patterns} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'delete' && (
        <AdminModal title="Delete Sub-Pattern" onClose={closeModal}>
          <ConfirmDelete name={modal.subPattern.name} onConfirm={() => { deleteSubPattern(modal.subPattern.id); closeModal(); }} onCancel={closeModal} />
        </AdminModal>
      )}
    </div>
  );
}
